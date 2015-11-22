# -*- coding: utf-8 -*-
from flask import Blueprint, g, request, jsonify, make_response
from flask.ext.login import make_secure_token
import datetime

from app import db
from app.models import User, Session, ROLE_CAR, ROLE_ADD

from validate_email import validate_email

api_auth = Blueprint('api_auth', __name__)


@api_auth.route('/api/auth/login', methods=['POST'])
def login():
    response = {'code': 0,
                'message': 'Missing parameters (email or password)'}
    email = request.form.get('email')
    password = request.form.get('password')
    if not email or not password:
        return make_response(jsonify(response), 400)
    user = User.query.filter_by(email=email, password=password).first()
    if user is not None:
        timestamp = (datetime.datetime.utcnow() +
                     datetime.timedelta(days=1)).timestamp()
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


@api_auth.route('/api/auth/check', methods=['POST'])
def check():
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


@api_auth.route('/api/auth/logout', methods=['POST'])
def logout():
    response = {'code': 0,
                'message': 'Already not authorized (or token forgotten)'}
    if not g.session:
        return make_response(jsonify(response), 400)
    db.session.delete(g.session)
    db.session.commit()
    response = {'code': 1,
                'message': 'OK'}
    return make_response(jsonify(response), 200)


@api_auth.route('/api/auth/reg', methods=['POST'])
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
        return make_response(
            jsonify(construct_response(2, 'Passwords do not match up')), 400)
    if user is not None:
        return make_response(jsonify(construct_response(
            3, 'User with this e-mail already exists')), 400)
    if not validate_email(email):
        return make_response(
            jsonify(construct_response(4, 'Email is not valid')), 400)
    if userrole == "reklamodatel":
        userrole = ROLE_ADD
    else:
        userrole = ROLE_CAR

    new_user = User(
        email=email,
        password=password,
        tel_number=tel_number,
        city=city,
        role=userrole,
        verified=False)

    db.session.add(new_user)
    db.session.commit()
    return make_response(jsonify(construct_response(0, 'OK')), 200)
