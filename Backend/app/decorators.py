# -*- coding: utf-8 -*-
from flask import g, request, redirect, url_for, make_response, jsonify
from app import app
from functools import wraps
from sqlalchemy.orm.exc import NoResultFound

from app.views import default_user
from app.models import Session


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
            return make_response(jsonify({'code': 0, 'message': 'Not authorized'}), 401)
        return f(*args, **kwargs)
    return decorated_function