# -*- coding: utf-8 -*-

import os
import datetime

from flask import Blueprint, g, request, jsonify, make_response
from app import app
from werkzeug import secure_filename
from sqlalchemy import or_, and_
from sqlalchemy.orm.exc import NoResultFound

from app import db
from app.models import Message, MessageHistory
from app.decorators import api_login_required


api_chat = Blueprint('api_chat', __name__)


@api_chat.route('/api/chat/message', methods=['POST'])
@api_login_required
def addMessage():
    receiver = request.form.get('to')
    message = request.form.get('chat-massage-writepanel')
    image = None
    try:
        image = request.files['file']
    except:
        pass

    if not receiver or not message:
        return make_response(jsonify(
            {'code': 0, 'message': 'Missing parameters (to or message)'}), 400)
    try:
        mes_hist = MessageHistory.query.filter(
            MessageHistory.user_id == g.user.id,
            MessageHistory.dest_id == receiver).one()
    except NoResultFound:
        db.session.add(MessageHistory(
            user_id=g.user.id, dest_id=receiver, timestamp=0))
    timestamp = datetime.datetime.utcnow().timestamp()

    new_message = Message(
        user_id=g.user.id,
        dest_id=receiver,
        message=message,
        timestamp=timestamp,
        type=Message.Type.text)
    
    db.session.add(new_message)

    if image:
        filename = secure_filename(image.filename)
        # Consider removing user ids from image path
        # It's useful but may harm the security
        # image.save(os.path.join(app.config['MESSAGES_UPLOAD_FOLDER'], str(g.user.id), receiver, filename))
        image.save(os.path.join(app.config['MESSAGES_UPLOAD_FOLDER'], filename))

        new_image = Message(
            user_id=g.user.id,
            dest_id=receiver,
            message='messages_uploads/' + filename,
            timestamp=timestamp,
            type=Message.Type.image)
        db.session.add(new_image)

    db.session.commit()
    return make_response(jsonify({'code': 1, 'message': 'OK'}), 200)


@api_chat.route('/api/chat/message', methods=['GET'])
@api_login_required
def getMessages():
    timestamp = request.args['timestamp']
    author = request.args['user']
    if not author:
        author = -1                         # <=====     !!! WTF? !!!
    if not timestamp:
        return make_response(jsonify(
            {'code': 0, 'message': 'Missing parameters (timestamp)'}), 400)
    messages = Message.query.filter(or_(
                                    and_(Message.user_id == g.user.id,
                                         Message.dest_id == author),
                                    and_(Message.dest_id == g.user.id,
                                         Message.user_id == author)
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
            MessageHistory.dest_id == g.user.id,
            MessageHistory.user_id == user).one()
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
            Message.dest_id == mh.dest_id,
            Message.user_id == mh.user_id,
            Message.timestamp > mh.timestamp).all())
        if new != 0:
            if mh.user.is_admin():
                ans.append({'new': new, 'from': mh.user_id, 'email': u'Техническая поддержка'})
            else:
                ans.append({'new': new, 'from': mh.user_id, 'email': mh.user.email})
    return make_response(jsonify({
        'code': 0,
        'message': 'OK',
        'data': {
            'arr': ans
        }}))
