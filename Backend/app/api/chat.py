# -*- coding: utf-8 -*-
from flask import Blueprint, g, request, jsonify, make_response
from sqlalchemy import or_, and_
from sqlalchemy.orm.exc import NoResultFound
import datetime

from app import db
from app.models import Message, MessageHistory
from app.decorators import api_login_required


api_chat = Blueprint('api_chat', __name__)


@api_chat.route('/api/chat/message', methods=['POST'])
@api_login_required
def addMessage():
    receiver = request.form.get('to')
    message = request.form.get('message')
    if not receiver or not message:
        return make_response(jsonify(
            {'code': 0, 'message': 'Missing parameters (to or message)'}), 400)
    try:
        mes_hist = MessageHistory.query.filter(
            MessageHistory.user_email == g.user.email,
            MessageHistory.dest_email == receiver).one()
    except NoResultFound:
        db.session.add(MessageHistory(
            user_email=g.user.email, dest_email=receiver, timestamp=0))
    timestamp = datetime.datetime.utcnow().timestamp()

    new_message = Message(
        user_email=g.user.email,
        dest_email=receiver,
        message=message,
        timestamp=timestamp)

    db.session.add(new_message)
    db.session.commit()
    return make_response(jsonify({'code': 1, 'message': 'OK'}), 200)


@api_chat.route('/api/chat/message', methods=['GET'])
@api_login_required
def getMessages():
    timestamp = request.args['timestamp']
    author = request.args['user']
    if not author:
        author = "qkjbdlkjndflkjsbdlfk"
    if not timestamp:
        return make_response(jsonify(
            {'code': 0, 'message': 'Missing parameters (timestamp)'}), 400)
    messages = Message.query.filter(or_(
                                    and_(Message.user_email == g.user.email,
                                         Message.dest_email == author),
                                    and_(Message.dest_email == g.user.email,
                                         Message.user_email == author)
                                    ),
                                    Message.timestamp >= timestamp).order_by(
        Message.timestamp).all()
    return make_response(
        jsonify({
            'code': 0,
            'message': 'OK',
            'data': {'messages': [m.serialize() for m in messages]}}),
        200)


@api_chat.route('/api/chat/seen', methods=['POST'])
@api_login_required
def manageSeenMessages():
    user = request.form.get('user')
    timestamp = float(request.form.get('timestamp'))
    if not user or not timestamp:
        return make_response(
            jsonify({
                'code': 0,
                'message': 'Missing parameters (user or timestamp)'}),
            400)
    try:
        mes_hist = MessageHistory.query.filter(
            MessageHistory.dest_email == g.user.email,
            MessageHistory.user_email == user).one()
        mes_hist.timestamp = timestamp
        db.session.commit()
    except NoResultFound:
        pass
    return make_response(jsonify({'code': 1, 'message': 'OK'}), 200)


@api_chat.route('/api/chat/seen', methods=['GET'])
@api_login_required
def getSeenTimestamps():
    ans = []
    for mh in g.user.send_to_me_history:
        new = len(Message.query.filter(
            Message.dest_email == mh.dest_email,
            Message.user_email == mh.user_email,
            Message.timestamp > mh.timestamp).all())
        if new != 0:
            ans.append({'new': new, 'from': mh.user_email})
    return make_response(jsonify({
        'code': 0,
        'message': 'OK',
        'data': {
            'arr': ans
        }}))
