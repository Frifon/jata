# -*- coding: utf-8 -*-

import json
from app import db, app
from app.models import Point
import datetime
from sqlalchemy import desc
from flask import render_template, flash, redirect, url_for, request, Request
from flask import g, abort, jsonify, make_response


@app.route('/api/gps', methods=['GET', 'POST'])
def apiGPS():
    if not g.user.is_authenticated():
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
