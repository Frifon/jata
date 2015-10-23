# -*- coding: utf-8 -*-

import json
from app import db
from app.models import Point
import datetime
from sqlalchemy import desc


def add(token, raw_points_json):
    try:
        raw_points = json.loads(raw_points_json)
        for raw_point in raw_points:
            point = Point(user_id=raw_point['user_id'],
                          latitude=raw_point['latitude'],
                          longtitude=raw_point['longtitude'],
                          altitude=raw_point['altitude'],
                          accuracy=raw_point['accuracy'],
                          timestamp=int(datetime.datetime.utcnow().timestamp()))
            db.session.add(point)
            db.session.commit()
        return 0
    except:
        return -1


def get(token, user_id, timestamp_start=0, timestamp_end=None):
    if not timestamp_end:
        timestamp_end = int((datetime.datetime.utcnow() + datetime.timedelta(weeks=1000)).timestamp())
    query = db.session.query(Point).filter(Point.user_id == user_id, Point.timestamp >= timestamp_start, Point.timestamp <= timestamp_start).order_by(desc('timestamp')).all()
    return query
