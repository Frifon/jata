# -*- coding: utf-8 -*-
from flask import render_template, flash, redirect, session, url_for, request
from flask import g, abort, jsonify
from flask.ext.login import login_user, logout_user, current_user
from flask.ext.login import login_required
from app import app, db, lm
from app.forms import LoginForm, RegForm
from app.models import User, ROLE_CAR, ROLE_ADD
import datetime

# ##################### CONSTANTS ######################
MIN_NAME_LEN = 4
MIN_TEXT_LEN = 10
# ######################################################

# ##################### USER LOGIN #####################


@app.before_request
def before_request():
    g.user = current_user


@lm.user_loader
def load_user(userid):
    return User.query.get(userid)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    print(form.validate())
    if request.method == 'POST' and form.validate():
        if request.form['submit'] == 'login':
            email = form.email.data
            password = form.password.data
            user = User.query.filter_by(email=email, password=password).first()
            print (email, password, user)
            if user is not None:
                login_user(user, remember=True)
            return redirect(url_for('index'))
        elif request.form['submit'] == 'register':
            return redirect(url_for('reg'))
    return redirect(url_for('index'))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/index', methods=['GET', 'POST'])
@app.route('/', methods=['GET', 'POST'])
def index():
    return base_render("index.html", title=u"Jata")


@app.route('/reg', methods=['GET', 'POST'])
def reg():
    if g.user.is_authenticated:
        return redirect(url_for('index'))
    form = RegForm()
    print(form.validate())
    if request.method == 'POST' and form.validate():
        password = form.password.data
        confirm_password = form.confirm_password.data
        email = form.email.data
        tel_number = form.tel_number.data
        city = form.city.data
        userrole = form.userrole.data
        print ("Email: {0} Password: {1} Confirm: {2} Tel: {3} City: {4} Userrole: {5}".format(
            email, password, confirm_password, tel_number, city, userrole))

        ok = True

        # if password != confirm_password:
        #     ok = False
        #     form.password.errors.append(u'Пароли не совпадают')

        # if len(email) <= 4:
        #     ok = False
        #     form.email.errors.append(u'Email должен быть длиннее 4 символов.')
        # if len(password) <= 4:
        #     ok = False
        #     form.password.errors.append(u'Пароль должен быть длиннее 4 символов.')

        user1 = User.query.filter_by(email=email).first()

        if user1 is not None:
            ok = False
            print ("Same email!")
            form.email.errors.append(u'Пользователь с таким email уже зарегистрирован.')
        if not ok:
            return redirect(url_for('index'))
        else:
            if userrole == "reklamodatel":
                userrole = ROLE_ADD
            else:
                userrole = ROLE_CAR
            tmp = User(email=email, password=password, tel_number=tel_number,
                       city=city, role=userrole)
            db.session.add(tmp)
            db.session.commit()
            login_user(tmp)
            return redirect(url_for('index'))
    return redirect(url_for('index'))


def base_render(*args, **kwargs):
    return render_template(*args, login_form=LoginForm(),
                           reg_form=RegForm(), **kwargs)
