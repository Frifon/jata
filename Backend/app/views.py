# -*- coding: utf-8 -*-
from flask import render_template, flash, redirect, url_for, request, Request, g, abort, jsonify, make_response, json
from flask.ext.login import login_user, logout_user, current_user, login_required, make_secure_token
from werkzeug import datastructures
from app import app, db #, lm
from app.forms import RegForm
from app.models import User, Session, ROLE_CAR, ROLE_ADD
import datetime



###################### CONSTANTS #######################
default_user = User(id=4000000000)          # DEPRECATED
################## ################# ###################



#################### COOKIE HELPERS ####################

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


######################  REST API  ######################

@app.route('/api/auth/login', methods = ['POST'])
def apiLogin():
    response = {'code': 0,
                'message': 'Missing parameters (email or password)'}
    email = request.form.get('email')
    password = request.form.get('password')
    if not email or not password:
        return make_response(jsonify(response), 400)
    user = User.query.filter_by(email=email, password=password).first()
    if user is not None:
        timestamp = (datetime.datetime.utcnow() + datetime.timedelta(days=1)).timestamp()
        token = make_secure_token(email, password, str(timestamp))
        db.session.add(Session(id=user.id, timestamp=int(timestamp), token=token))
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
                        'message': 'User does not exist'}
    if response['code'] is 1:
        return make_response(jsonify(response), 200)
    return make_response(jsonify(response), 401)


@app.route('/api/auth/check', methods = ['POST'])
def apiCheckToken():
    response = {'code': 0,
                'message': 'Missing parameters (token)'}
    token = request.form.get('token')
    if not token:
        return make_response(jsonify(response), 400)
    session = Session.query.filter_by(token=token).first()
    if not session or not session.is_valid():
        if session:
            db.session.delete(session)
            db.session.commit()
        response['message'] = 'Token expired'
    else:
        response = {'code': 1,
                    'message': 'OK'}
    if response['code'] is 1:
        return make_response(jsonify(response), 200)
    return make_response(jsonify(response), 401)


@app.route('/api/auth/logout', methods = ['POST'])
def apiLogout():
    response = {'code': 0,
                'message': 'Missing parameters (token)'}
    token = request.form.get('token')
    if not token:
        return make_response(jsonify(response), 400)
    session = Session.query.filter_by(token=token).first()
    if session:
        db.session.delete(session)
        db.session.commit()
    response = {'code': 1,
                'message': 'OK'}
    return make_response(jsonify(response), 200)


@app.route('/reg', methods = ['POST'])              # DEPRECATED
@app.route('/api/auth/reg', methods = ['POST'])
def reg():
    def construct_response(code, message):
        return {'code': code, 'message': message}
    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')
    tel_number = request.form.get('tel_number')
    city = request.form.get('city')
    userrole = request.form.get('userrole')
    if not email:
        return make_response(jsonify(missing_param('e-mail')), 400)
    if not password:
        return make_response(jsonify(missing_param('password')), 400)
    if not confirm_password:
        return make_response(jsonify(missing_param('Confirm_password')), 400)
    if not tel_number:
        return make_response(jsonify(missing_param('tel. number')), 400)
    if not city:
        return make_response(jsonify(missing_param('city')), 400)
    if not userrole:
        return make_response(jsonify(missing_param('userrole')), 400)
    user = User.query.filter_by(email=email).first()
    if password != confirm_password:
        return make_response(jsonify(construct_response(2, 'Passwords do not match up')), 400)
    if user is not None:
        return make_response(jsonify(construct_response(3, 'User with this e-mail already exists')), 400)
    if userrole == "reklamodatel":
        userrole = ROLE_ADD
    else:
        userrole = ROLE_CAR
    new_user = User(email=email, password=password, tel_number=tel_number, city=city, role=userrole)
    db.session.add(new_user)
    db.session.commit()
    return make_response(jsonify(construct_response(0, 'OK')), 200)
    

###################### USER LOGIN ######################

def make_internal_redirect(path, method, data):
    headers = datastructures.Headers()
    if method is 'POST':
        headers.add('Content-Type', 'application/x-www-form-urlencoded')
    with app.test_request_context(path, method=method, data=data, headers=headers):
        return app.full_dispatch_request()


@app.before_request
def before_request():
    token = request.cookies.get('token')
    user = default_user
    g.token, g.session = None, None
    if token:
        g.token = token
        session = Session.query.filter_by(token=token).first()
        g.session = session
        if session:
            user = User.query.filter_by(id=session.id).first()
    g.user = user


@app.route('/login', methods = ['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    rv = app.test_client().post('/api/auth/login', data={'email': email, 'password': password}, follow_redirects=True)
    result = json.loads(rv.data)
    if result is None or not 'data' in result:
        return redirect(url_for('index'))

    @after_this_request
    def add_cookie_token(response):
        response.set_cookie('token', result['data']['token'])

    return redirect(url_for('index'))


@app.route('/logout', methods = ['GET'])
def logout():
    token = request.cookies.get('token')
    rv = app.test_client().post('/api/auth/logout', data={'token': token}, follow_redirects=True)
    result = json.loads(rv.data)
    return redirect(url_for('index'))


@app.route('/index', methods = ['GET', 'POST'])
@app.route('/', methods = ['GET', 'POST'])
def index():
    return base_render("index.html", title=u"Jata")


@app.route('/profile')
def profile():
    return render_template('profile.html')

def base_render(*args, **kwargs):
    return render_template(*args, reg_form=RegForm(), **kwargs)


#################### ERROR HANDLERS ####################

@app.errorhandler(405)
def error405(error):
    url = str(request.base_url)
    if not 'api' in url:
        return
    return make_response(jsonify({'error': 'Method not allowed',
                                  'code': 405}))


@app.errorhandler(404)
def error405(error):
    url = str(request.base_url)
    if not 'api' in url:
        return
    return make_response(jsonify({'error': 'Method not found',
                                  'code': 404}))