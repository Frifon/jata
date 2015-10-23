# -*- coding: utf-8 -*-

from flask import render_template, flash, redirect, url_for, request, Request
from flask import g, abort, jsonify, make_response
from flask.ext.login import login_user, logout_user, current_user
from flask.ext.login import login_required, make_secure_token
from app import app, db, lm
from app.forms import RegForm
from app.models import User, Session, ROLE_CAR, ROLE_ADD
import datetime


# ##################### CONSTANTS #######################
MIN_NAME_LEN = 4
MIN_TEXT_LEN = 10
# ################# ################# ###################

default_user = User(id=4000000000)

# ################### COOKIE HELPERS ####################


def after_this_request(f):
    if not hasattr(g, 'after_request_callbacks'):
        g.after_request_callbacks = []
    g.after_request_callbacks.append(f)
    return f


@app.after_request
def call_after_request_callbacks(response):
    for callback in getattr(g, 'after_request_callbacks', ()):
        callback(response)
    return response


# #####################  REST API  ######################


@app.route('/api/auth/login', methods=['POST'])
def apiLogin(internal=False):
    response = {'code': 0,
                'message': 'Missing parameters (email or password)'}
    email = request.form.get('email')
    password = request.form.get('password')
    if not email or not password:
        if internal:
            return
        return make_response(jsonify(response), 400)
    user = User.query.filter_by(email=email, password=password).first()
    if user is not None:
        timestamp = int((datetime.datetime.utcnow() + datetime.timedelta(weeks=1)).timestamp())
        token = make_secure_token(email, password, str(timestamp))
        session = Session.query.filter_by(id=user.id).first()
        if session:
            db.session.delete(session)
        db.session.add(Session(id=user.id, timestamp=timestamp, token=token))
        db.session.commit()
        response = {'code': 1,
                    'message': 'OK',
                    'data': {'token': token,
                             'expirationTimestamp': timestamp}}
    else:
        user = User.query.filter_by(email=email).first()
        if user:
            response = {'code': 0,
                        'message': 'Invalid password'}
        else:
            response = {'code': 0,
                        'message': "User doesn't exist"}
    if internal:
        return response
    if response['code'] is 1:
        return make_response(jsonify(response), 200)
    return make_response(jsonify(response), 401)


@app.route('/api/auth/check', methods=['POST'])
def apiCheckToken(internal=False):
    response = {'code': 0,
                'message': 'Missing parameters (token)'}
    token = request.form.get('token')
    if internal:
        token = request.cookies.get('token')
    if not token:
        if internal:
            return
        return make_response(jsonify(response), 400)
    session = Session.query.filter_by(token=token).first()
    if session:
        if not session.is_valid():
            db.session.delete(session)
            db.session.commit()
            response['message'] = 'Expired'
        else:
            response = {'code': 1,
                        'message': 'OK'}
    if internal:
        return response
    if response['code'] is 1:
        return make_response(jsonify(response), 200)
    return make_response(jsonify(response), 401)


@app.route('/api/auth/logout', methods=['POST'])
def apiLogout(internal=False):
    response = {'code': 0,
                'message': 'Missing parameters (token)'}
    token = request.form.get('token')
    if internal:
        token = request.cookies.get('token')
    if not token:
        if internal:
            return
        return make_response(jsonify(response), 400)
    session = Session.query.filter_by(token=token).first()
    if session:
        db.session.delete(session)
        db.session.commit()
    response = {'code': 1,
                'message': 'OK'}
    if internal:
        return response
    return make_response(jsonify(response), 200)


@app.before_request
def before_request():
    token = request.cookies.get('token')
    user = None
    if token:
        session = Session.query.filter_by(token=token).first()
        if session:
            user = User.query.filter_by(id=session.id).first()
    if not user:
        user = default_user
    g.user = user


@app.route('/login', methods=['POST'])
def login():
    result = apiLogin(internal=True)
    if result is None or 'data' not in result:
        return redirect(url_for('index'))


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

    @after_this_request
    def add_cookie_token(response):
        response.set_cookie('token', result['data']['token'])

    return redirect(url_for('index'))


@app.route('/logout')
def logout():
    result = apiLogout(internal=True)
    return redirect(url_for('index'))


@app.route('/index', methods=['GET', 'POST'])
@app.route('/', methods=['GET', 'POST'])
def index():
    return base_render("index.html", title=u"Jata")


@app.route('/reg', methods=['GET', 'POST'])
def reg():
    if g.user.is_authenticated():
        return redirect(url_for('index'))
    form = RegForm()
    if request.method == 'POST' and form.validate():
        password = form.password.data
        confirm_password = form.confirm_password.data
        email = form.email.data
        tel_number = form.tel_number.data
        city = form.city.data
        userrole = form.userrole.data

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
            # login_user(tmp)
            g.user = tmp
            return make_response(redirect(url_for('index')))

    return make_response(redirect('/'))


def base_render(*args, **kwargs):
    return render_template(*args, reg_form=RegForm(), **kwargs)


# ################### ERROR HANDLERS ####################

@app.errorhandler(405)
def error405(error):
    url = str(request.base_url)
    if 'api' not in url:
        return
    return make_response(jsonify({'error': 'Method not allowed',
                                  'code': 405}))
