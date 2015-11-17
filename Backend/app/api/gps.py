# -*- coding: utf-8 -*-
from flask import Blueprint, g, request, jsonify, make_response
from sqlalchemy import desc
import json
import datetime

from app import db
from app.models import Point
from app.decorators import api_login_required


api_gps = Blueprint('api_gps', __name__)


@api_gps.route('/api/gps', methods=['GET', 'POST'])
@api_login_required
def apiGPS():
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
                          timestamp=int(
                              datetime.datetime.utcnow().timestamp()))
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
            timestamp_end = int(
                (datetime.datetime.utcnow() +
                    datetime.timedelta(weeks=1000)).timestamp())

        query = db.session.query(Point).filter(
            Point.user_id == user_id,
            Point.timestamp >= timestamp_start,
            Point.timestamp <= timestamp_start).order_by(
            desc('timestamp')).all()

        response = {'code': 1,
                    'message': json.dumps(query)}
        return response
