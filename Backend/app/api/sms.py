# -*- coding: utf-8 -*-
from flask import Blueprint, g, request, jsonify, make_response

from twilio.rest import TwilioRestClient
from random import seed, randint

from app import db
from app.decorators import api_login_required


ACCOUNT_SID = 'AC3bb495add54775d115ea318db0ea9a66'
AUTH_TOKEN = '3d7be37e37ba9f0e0f1a08b3069da139'
secret_salt = 's3CrET_*_5a|T___fuk7h43f78g743fhkusehf74vufdhgk'

api_sms = Blueprint('api_sms', __name__)


def preparePhoneNumber():
    return '+7' + g.user.tel_number.replace(
        ' ', '').replace('-', '').replace('(', '').replace(')', '')


def genCode():
    tel_number = preparePhoneNumber()
    seed(tel_number + g.user.email + secret_salt)
    return randint(10000, 99999)


@api_sms.route('/api/sms/send', methods=['POST'])
@api_login_required
def sendSms():
    global secret_salt

    code = genCode()

    client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)
    client.messages.create(
        to=preparePhoneNumber(),
        from_="+18582174804",
        body=u"Здравствуйте.\nВаш код подтверждения: {0}\nJata.ru".format(
            str(code)),
    )
    return make_response(jsonify({'code': 1, 'message': 'OK'}), 200)


@api_sms.route('/api/sms/check', methods=['POST'])
@api_login_required
def checkCode():
    global secret_salt

    code = request.form.get('code')
    if not code:
        return make_response(jsonify({'code': 0,
                                      'message': 'Missing parameters (code)'}),
                             400)

    if int(code) == genCode():
        g.user.verified = True
        db.session.commit()
        return make_response(jsonify({'code': 1, 'message': 'OK'}), 200)

    return make_response(jsonify({'code': 0, 'message': 'Wrong code'}), 400)
