from app import db
from flask import g
from hashlib import md5
from random import randint
from datetime import datetime
from sqlalchemy.orm import relationship, backref


class Role():
    car = 1
    add = 2
    admin = 4


class DefaultUser():
    class DefaultUserException(Exception):
        def __init__(self, value):
            self.value = value

        def __str__(self):
            return repr(self.value)

    def __getattr__(self, name):
        raise self.DefaultUserException(name + ' attribute does not exist')

    def __setattr__(self, name):
        raise self.DefaultUserException('manipulating the DefaultUser instance is forbidden')

    @staticmethod
    def is_admin(self):
        return False

    @staticmethod
    def __repr__(self):
        return 'None:None'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)

    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(30), index=True)
    tel_number = db.Column(db.String(30), index=True)
    city = db.Column(db.String(60), index=True)
    role = db.Column(db.SmallInteger, default=Role.car, index=True)

    name = db.Column(db.String(60), index=True)
    surname = db.Column(db.String(60), index=True)
    middle_name = db.Column(db.String(60), index=True)
    birthday = db.Column(db.Date, index=True)
    company_name = db.Column(db.String(120), index=True)
    contract_number = db.Column(db.String(60), index=True)
    verified = db.Column(db.Boolean, index=True)

    def is_admin(self):
        return self.role & Role.admin

    def __repr__(self):
        return '{0}:{1}'.format(self.id, self.email)


class Message(db.Model):
    __table_args__ = {'sqlite_autoincrement': True}

    id = db.Column(db.Integer, primary_key=True, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), index=True)
    dest_id = db.Column(db.Integer, db.ForeignKey(User.id), index=True)
    message = db.Column(db.String(3000), index=True)
    timestamp = db.Column(db.Float, index=True)

    user = relationship(
        'User',
        backref=backref('send_by_me_messages', order_by=timestamp),
        primaryjoin='Message.user_id == User.id')

    dest = relationship(
        'User',
        backref=backref('send_to_me_messages', order_by=timestamp),
        primaryjoin='Message.dest_id == User.id')

    def serialize(self):
        return {
            'from': self.user_id,
            'to': self.dest_id,
            'timestamp': self.timestamp,
            'message': self.message
        }

    def __repr__(self):
        return u'{0} ==> {1} : {2} ({3} : {4})'.format(
            self.user_id, self.dest_id, self.message, self.id, self.timestamp)


class Session(db.Model):
    token = db.Column(
        db.String(128), primary_key=True, index=True, unique=True)
    timestamp = db.Column(db.Integer)
    id = db.Column(db.Integer, db.ForeignKey(User.id), index=True)
    user = relationship(
        'User', backref=backref('sessions', order_by=timestamp))

    def is_valid(self):
        return self.timestamp >= int(datetime.utcnow().timestamp())

    def __repr__(self):
        return '<Session token: {0} timestamp: {1} id: {2} user: {3}>'.format(
            self.token, self.timestamp, self.id, self.user)


class MessageHistory(db.Model):
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(User.id),
        primary_key=True,
        index=True)

    dest_id = db.Column(
        db.Integer,
        db.ForeignKey(User.id),
        primary_key=True,
        index=True)

    timestamp = db.Column(db.Float)

    user = relationship(
        'User',
        backref=backref('send_by_me_history', order_by=dest_id),
        primaryjoin='MessageHistory.user_id == User.id')

    dest = relationship(
        'User',
        backref=backref('send_to_me_history', order_by=user_id),
        primaryjoin='MessageHistory.dest_id == User.id')

    def serialize(self):
        return {
            'id': self.user_id,
            'timestamp': self.timestamp
        }

    def __repr__(self):
        return '{0} ==> {1} : {2}'.format(self.user_id, self.dest_id, self.timestamp)


class Representative(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(60), index=True)
    email = db.Column(db.String(120), index=True, unique=True)
    tel_number = db.Column(db.String(30), index=True)
    company_id = db.Column(db.Integer, index=True)

    def __repr__(self):
        return 'Id: {0} Email: {1}'.format(self.id, self.email)


class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    car_type = db.Column(db.String(30), index=True)
    car_usage_type = db.Column(db.String(30), index=True)
    car_activities = db.Column(db.String(30), index=True)
    car_brand = db.Column(db.String(30), index=True)
    car_model = db.Column(db.String(30), index=True)
    car_year = db.Column(db.String(30), index=True)
    car_color = db.Column(db.String(30), index=True)
    user_id = db.Column(db.Integer, index=True)
    car_photo = db.Column(db.String(30), index=True)


# ######################## GPS ##########################

class Point(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, index=True)
    latitude = db.Column(db.Float, index=True)
    longtitude = db.Column(db.Float, index=True)
    altitude = db.Column(db.Float, index=True)
    accuracy = db.Column(db.SmallInteger, index=True)
    timestamp = db.Column(db.Integer, index=True)
    name = db.Column(db.String(30), index=True)

    def __str__(self):
        return ("Point id: {}\n".format(str(self.id)) +
                "User id: {}\n".format(str(self.user_id)) +
                "Coordinates: ({} | {})\n".format(str(self.latitude),
                                                  str(self.longtitude)) +
                "Altitude: {}\n".format(str(self.altitude)) +
                "Accuracy: {}\n".format(str(self.accuracy)) +
                "Name: {}\n".format(str(self.name)) +
                "Timestamp: {}\n".format(str(self.timestamp)))

    def __repr__(self):
        return ("Point id: {}\n".format(str(self.id)) +
                "User id: {}\n".format(str(self.user_id)) +
                "Coordinates: ({} | {})\n".format(str(self.latitude),
                                                  str(self.longtitude)) +
                "Altitude: {}\n".format(str(self.altitude)) +
                "Accuracy: {}\n".format(str(self.accuracy)) +
                "Name: {}\n".format(str(self.name)) +
                "Timestamp: {}\n".format(str(self.timestamp)))


class Route(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, index=True)
    car_id = db.Column(db.Integer, index=True)
    route_name = db.Column(db.String(30), index=True)

    route_type = db.Column(db.Integer, index=True)  # 0 - fixed, 1 - neighbourhood, 2 - random
    route_fixed_type = db.Column(db.Integer, index=True)  # 0 - one way, 1 - return

    start_point_id = db.Column(db.Integer, index=True)
    finish_point_id = db.Column(db.Integer, index=True)

    route_days = db.Column(db.Integer, index=True)  # 0 - working days, 1 - all days, 2 - weekends, 3 - random

    route_time_start = db.Column(db.String(30), index=True)
    route_time_end = db.Column(db.String(30), index=True)

    route_monday = db.Column(db.Integer, index=True)
    route_tuesday = db.Column(db.Integer, index=True)
    route_wednesday = db.Column(db.Integer, index=True)
    route_thursday = db.Column(db.Integer, index=True)
    route_friday = db.Column(db.Integer, index=True)
    route_saturday = db.Column(db.Integer, index=True)
    route_sunday = db.Column(db.Integer, index=True)

    route_monday_start = db.Column(db.String(30), index=True)
    route_tuesday_start = db.Column(db.String(30), index=True)
    route_wednesday_start = db.Column(db.String(30), index=True)
    route_thursday_start = db.Column(db.String(30), index=True)
    route_friday_start = db.Column(db.String(30), index=True)
    route_saturday_start = db.Column(db.String(30), index=True)
    route_sunday_start = db.Column(db.String(30), index=True)

    route_monday_end = db.Column(db.String(30), index=True)
    route_tuesday_end = db.Column(db.String(30), index=True)
    route_wednesday_end = db.Column(db.String(30), index=True)
    route_thursday_end = db.Column(db.String(30), index=True)
    route_friday_end = db.Column(db.String(30), index=True)
    route_saturday_end = db.Column(db.String(30), index=True)
    route_sunday_end = db.Column(db.String(30), index=True)

    route_time_start_back = db.Column(db.String(30), index=True)
    route_time_end_back = db.Column(db.String(30), index=True)

    route_monday_back = db.Column(db.Integer, index=True)
    route_tuesday_back = db.Column(db.Integer, index=True)
    route_wednesday_back = db.Column(db.Integer, index=True)
    route_thursday_back = db.Column(db.Integer, index=True)
    route_friday_back = db.Column(db.Integer, index=True)
    route_saturday_back = db.Column(db.Integer, index=True)
    route_sunday_back = db.Column(db.Integer, index=True)

    route_monday_start_back = db.Column(db.String(30), index=True)
    route_tuesday_start_back = db.Column(db.String(30), index=True)
    route_wednesday_start_back = db.Column(db.String(30), index=True)
    route_thursday_start_back = db.Column(db.String(30), index=True)
    route_friday_start_back = db.Column(db.String(30), index=True)
    route_saturday_start_back = db.Column(db.String(30), index=True)
    route_sunday_start_back = db.Column(db.String(30), index=True)

    route_monday_end_back = db.Column(db.String(30), index=True)
    route_tuesday_end_back = db.Column(db.String(30), index=True)
    route_wednesday_end_back = db.Column(db.String(30), index=True)
    route_thursday_end_back = db.Column(db.String(30), index=True)
    route_friday_end_back = db.Column(db.String(30), index=True)
    route_saturday_end_back = db.Column(db.String(30), index=True)
    route_sunday_end_back = db.Column(db.String(30), index=True)

    comment = db.Column(db.String(300), index=True)
