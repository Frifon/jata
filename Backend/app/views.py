# -*- coding: utf-8 -*-
from flask import render_template, flash, redirect, session, url_for, request, g, abort, jsonify
from flask.ext.login import login_user, logout_user, current_user, login_required
from app import app, db, lm
from app.forms import LoginForm, RegForm
from app.models import User
import datetime



###################### CONSTANTS ######################
MIN_NAME_LEN = 4
MIN_TEXT_LEN = 10
################## ################# ##################



###################### USER LOGIN ######################
@app.before_request
def before_request():
    g.user = current_user

@lm.user_loader
def load_user(userid):
    return User.query.get(userid)

@app.route('/login', methods = ['GET', 'POST'])
def login():
    form = LoginForm()
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

@app.route('/index', methods = ['GET', 'POST'])
@app.route('/', methods = ['GET', 'POST'])
def index():
    return base_render("index.html", title=u"Jata")


@app.route('/reg', methods = ['GET', 'POST'])
def reg():
    if g.user.is_authenticated:
        return url_for('index')
    form = RegForm()
    if request.method == 'POST' and form.validate():
        password = form.password.data
        email = form.email.data

        ok = True

        if (len(email) <= 4):
            ok = False
            form.email.errors.append(u'Email должен быть длиннее 4 символов.')
        if (len(password) <= 4):
            ok = False
            form.password.errors.append(u'Пароль должен быть длиннее 4 символов.')

        user1 = User.query.filter_by(email=email).first()

        if user1 is not None:
            ok = False
            form.email.errors.append(u'Пользователь с таким email уже зарегистрирован.')
        if not ok:
            return base_render('reg.html', reg_form=form)
        else:
            tmp = User(email=email, password=password)
            db.session.add(tmp)
            db.session.commit()
            login_user(tmp)
            return redirect(url_for('index'))
    return base_render('reg.html', reg_form=form)

def base_render(*args, **kwargs):
    return render_template(*args, login_form=LoginForm(), **kwargs)