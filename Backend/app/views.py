# -*- coding: utf-8 -*-
from flask import render_template, redirect, url_for, request, g, jsonify, make_response, flash, Request, abort, jsonify
from flask.ext.login import make_secure_token
from werkzeug import datastructures
from app import app, db #, lm
from app.forms import RegForm
from app.models import User, Session, Message, ROLE_CAR, ROLE_ADD, Representative
from sqlalchemy import or_, and_
from sqlalchemy.orm.exc import NoResultFound
import datetime
from functools import wraps
import json
from app.models import Point
from sqlalchemy import desc


###################### CONSTANTS #######################
default_user = User(id=12345678987654321)   # DEPRECATED
################## ################# ###################



####################### WRAPPERS #######################

@app.before_request
def before_request():
    token = request.cookies.get('token')
    user = default_user
    g.token, g.session, g.auth = None, None, False
    if not token:
        token = request.form.get('token')
    if not token:
        try:
            token = request.args['token']
        except:
            token = None
    g.token = token
    if token:
        session = None
        try:
            session = Session.query.filter_by(token=token).one()
        except NoResultFound:
            pass
        g.session = session
        g.auth = (session and session.is_valid())
        if session:
            user = session.user
    g.user = user


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


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not g.auth:
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function


def api_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not g.auth:
            return make_response(jsonify({'code': 0, 'message': 'Not authorized'}), 400)
        return f(*args, **kwargs)
    return decorated_function



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
        timestamp = int(timestamp)
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
                        'message': 'User does not exist'}
    if response['code'] is 1:
        return make_response(jsonify(response), 200)
    return make_response(jsonify(response), 401)


@app.route('/api/auth/check', methods = ['POST'])
def apiCheckToken():
    response = {'code': 0,
                'message': 'Token expired or does not exist'}
    if not g.auth:
        if g.session:
            db.session.delete(g.session)
            db.session.commit()
    else:
        response = {'code': 1,
                    'message': 'OK'}
    if response['code'] is 1:
        return make_response(jsonify(response), 200)
    return make_response(jsonify(response), 401)


@app.route('/api/auth/logout', methods = ['POST'])
def apiLogout():
    response = {'code': 0,
                'message': 'Already not authorized (or token forgotten)'}
    if not g.session:
        return make_response(jsonify(response), 400)
    db.session.delete(g.session)
    db.session.commit()
    response = {'code': 1,
                'message': 'OK'}
    return make_response(jsonify(response), 200)


@app.route('/reg', methods = ['POST'])
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
        return make_response(jsonify(missing_param('confirm_password')), 400)
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


@app.route('/api/chat', methods = ['POST'])
@api_login_required
def addMessage():
    receiver = request.form.get('to')
    message = request.form.get('message')
    if not receiver or not message:
        return make_response(jsonify({'code': 0,
                                      'message': 'Missing parameters (to or message)'}),
                             400)
    timestamp = datetime.datetime.utcnow().timestamp()
    new_message = Message(user_email=g.user.email, dest_email=receiver, message=message, timestamp=timestamp)
    db.session.add(new_message)
    db.session.commit()
    return make_response(jsonify({'code': 1, 'message': 'OK'}), 200)


@app.route('/api/chat', methods = ['GET'])
@api_login_required
def getMessages():
    limit = request.args['limit']
    author = request.args['from']
    if not author:
        author = "qkjbdlkjndflkjsbdlfk"       # Well designed by Artem (OK, at least it's surely not an e-mail)
    if not limit:
        return make_response(jsonify({'code': 0,
                                      'message': 'Missing parameters (limit)'}),
                             400)
    messages = Message.query.filter(or_(
                                        and_(Message.user_email == g.user.email, Message.dest_email == author), 
                                        and_(Message.dest_email == g.user.email, Message.user_email == author)),
                                    Message.timestamp >= limit).order_by(Message.timestamp).all()
    return make_response(jsonify({'code': 0,
                                  'message': 'OK',
                                  'data': {'messages': [m.serialize() for m in messages]}}),
                         200)


@app.route('/api/gps', methods=['GET', 'POST'])
def apiGPS():
    if not g.auth:
        response = {'code': 0,
                    'message': 'Invalid token'}
        return response

    if request.method == 'POST':
        raw_points_json = request.form.get('points')
        if not raw_points_json:
            response = {'code': 0,
                        'message': 'JSON missing'}
            return response

        try:
            raw_points = json.loads(raw_points_json)
        except:
            response = {'code': 0,
                        'message': 'Invalid JSON'}
            return response

        for raw_point in raw_points:
            point = Point(user_id=raw_point['user_id'],
                          latitude=raw_point['latitude'],
                          longtitude=raw_point['longtitude'],
                          altitude=raw_point['altitude'],
                          accuracy=raw_point['accuracy'],
                          timestamp=int(datetime.datetime.utcnow().timestamp()))
            db.session.add(point)
            db.session.commit()

        response = {'code': 1,
                    'message': 'OK'}
        return response
    else:
        user_id = request.form.get('user_id')
        timestamp_start = request.form.get('timestamp_start')
        timestamp_end = request.form.get('timestamp_end')

        if not user_id:
            response = {'code': 0,
                        'message': 'User id missing'}
            return response
        if not timestamp_start:
            timestamp_start = 0
        if not timestamp_end:
            timestamp_end = int((datetime.datetime.utcnow() + datetime.timedelta(weeks=1000)).timestamp())

        query = db.session.query(Point).filter(Point.user_id == user_id, Point.timestamp >= timestamp_start, Point.timestamp <= timestamp_start).order_by(desc('timestamp')).all()

        response = {'code': 1,
                    'message': json.dumps(query)}
        return response


###################### USER LOGIN ######################

# def make_internal_redirect(path, method, data):
#     headers = datastructures.Headers()
#     if method is 'POST':
#         headers.add('Content-Type', 'application/x-www-form-urlencoded')
#     with app.test_request_context(path, method=method, data=data, headers=headers):
#         return app.full_dispatch_request()


@app.route('/login', methods = ['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    rv = app.test_client().post('/api/auth/login', data={'email': email, 'password': password}, follow_redirects=True)
    result = json.loads(rv.data.decode('unicode_escape'))
    if result is None or not 'data' in result:
        return redirect(url_for('index'))

    @after_this_request
    def add_cookie_token(response):
        response.set_cookie('token', result['data']['token'])

    return redirect(url_for('index'))


@app.route('/logout', methods = ['GET'])
def logout():
    rv = app.test_client().post('/api/auth/logout', data={'token': g.token}, follow_redirects=True)
    result = json.loads(rv.data.decode('unicode_escape'))
    return redirect(url_for('index'))


@app.route('/index', methods = ['GET', 'POST'])
@app.route('/', methods = ['GET', 'POST'])
def index():
    return base_render("index.html", title=u"Jata")


@app.route('/change_password', methods = ['POST'])
def change_password():

    def construct_response(code, message):
        return {'code': code, 'message': message}
    def incorrect_param(p):
        return construct_response(1, 'Incorrect parameter: {0}'.format(p))
    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))

    old_password = request.form.get('old-password')
    new_password = request.form.get('new-password')
    new_password_confirmation = request.form.get('new-password-confirmation')

    if not old_password:
        return make_response(jsonify(missing_param('old_password')), 400)
    if not new_password:
        return make_response(jsonify(missing_param('new_password')), 400)
    if not new_password_confirmation:
        return make_response(jsonify(missing_param('new_password_confirmation')), 400)

    if old_password != g.user.password:
        return make_response(jsonify(incorrect_param('old_password')), 400)
    if new_password != new_password_confirmation:
        return make_response(jsonify(incorrect_param('new_password_confirmation')), 400)

    g.user.password = new_password
    db.session.commit()

    return make_response(jsonify(construct_response(0, 'OK')), 200)


@app.route('/profile')
@login_required
def profile():
    if g.user.role == 2:
        representatives = Representative.query.filter_by(company_id=g.session.id).all()
        print(representatives)
        return render_template('profile.html', representatives=representatives)
    else:
        return render_template('profile.html')

@app.route('/favicon.ico')
def favicon_ico():
    return ''

def base_render(*args, **kwargs):
    return render_template(*args, reg_form=RegForm(), **kwargs)


@app.route('/update_profile/<int:role>', methods = ['POST'])
@login_required
def update_profile(role):
    
    def construct_response(code, message):
        return {'code': code, 'message': message}
    def incorrect_param(p):
        return construct_response(1, 'Incorrect parameter: {0}'.format(p))
    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))

    if role == 1:
        surname = request.form.get('user-lastname')
        name = request.form.get('user-firstname')
        middle_name = request.form.get('user-middlename')
        birthday = request.form.get('user-birthday')
        tel_number = request.form.get('user-phone')
        email = request.form.get('user-email')
        
        if not surname:
            return make_response(jsonify(missing_param('surname')), 400)
        if not name:
            return make_response(jsonify(missing_param('name')), 400)
        if not middle_name:
            return make_response(jsonify(missing_param('middle_name')), 400)
        if not birthday:
            return make_response(jsonify(missing_param('birthday')), 400)
        if not tel_number:
            return make_response(jsonify(missing_param('tel_number')), 400)
        if not email:
            return make_response(jsonify(missing_param('email')), 400)

        g.user.surname = surname
        g.user.name = name
        g.user.middle_name = middle_name
        birthday = list(map(int, birthday.split('-')))
        g.user.birthday = datetime.date(birthday[2], birthday[1], birthday[0])
        g.user.tel_number = tel_number
        g.user.email = email
        db.session.commit()
        return make_response(jsonify(construct_response(0, 'OK')), 200)

    elif role == 2:
        company_name = request.form.get('company-name')
        company_representative_name = request.form.get('company-representative-name')
        company_representative_email = request.form.get('company-representative-email')
        company_representative_phone = request.form.get('company-representative-phone')

        if not company_name:
            return make_response(jsonify(missing_param('company_name')), 400)
        if not company_representative_name:
            return make_response(jsonify(missing_param('company_representative_name')), 400)
        if not company_representative_phone:
            return make_response(jsonify(missing_param('company_representative_phone')), 400)
        if not company_representative_email:
            return make_response(jsonify(missing_param('company_representative_email')), 400)
        if not company:
            return make_response(jsonify(missing_param('company')), 400)
        if not company_type:
            return make_response(jsonify(missing_param('company_type')), 400)

        g.user.company = company
        g.user.company_type = company_type

        new_representative = Representative(
            email=company_representative_email,
            tel_number=company_representative_phone,
            name=company_representative_name,
            company_id=user.id)

        db.session.add(new_representative)
        db.session.commit()
        return make_response(jsonify(construct_response(0, 'OK')), 200)
    else:
        return make_response(jsonify(incorrect_param('role')), 400)


@app.route('/chat')
@login_required
def chat():
    users = []
    if g.user:
        if g.user.is_admin():
            users = [user.email for user in User.query.all() if not(user.is_admin())]
        else:
            users = [u"Техническая поддержка"]
    return render_template('chat.html', users=users)



#################### ERROR HANDLERS ####################

@app.errorhandler(405)
def error405(error):
    url = str(request.base_url)
    if not 'api' in url:
        return redirect(url_for('index'))
    return make_response(jsonify({'error': 'Method not allowed',
                                  'code': 405}))


@app.errorhandler(404)
def error404(error):
    url = str(request.base_url)
    if not 'api' in url:
        return redirect(url_for('index'))
    return make_response(jsonify({'error': 'Method not found',
                                  'code': 404}))