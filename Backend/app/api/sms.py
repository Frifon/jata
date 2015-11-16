# -*- coding: utf-8 -*-
from flask import Blueprint, g, request, jsonify, make_response

from twilio.rest import TwilioRestClient
from random import seed, randint

ACCOUNT_SID = "AC3bb495add54775d115ea318db0ea9a66" 
AUTH_TOKEN = "3d7be37e37ba9f0e0f1a08b3069da139" 

api_sms = Blueprint('api_sms', __name__)

@api_sms.route('/api/sms/send_sms', methods=['POST'])
def SendSms():
    
    tel_number = request.form.get('tel_number')
    
    if not tel_number:
        return make_response(jsonify({'code': 0,
                                      'message': 'Missing parameter (tel_number)'}),
                             400)
    tel_number = tel_number.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
    tel_number = '+7' + tel_number
    seed(tel_number)
    number = randint(10000, 99999)


    client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN) 
 
    client.messages.create(
        to=tel_number, 
        from_="+18582174804", 
        body=u"Здравствуйте.\nВаш код подтверждения: {0}\nJata.ru".format(str(number)),
    )
    return make_response(jsonify({'code': 1, 'message': 'OK'}), 200)
