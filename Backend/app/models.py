from app import db
from flask import g
from hashlib import md5
from random import randint
from datetime import datetime
from sqlalchemy.orm import relationship, backref

ROLE_CAR = 1
ROLE_ADD = 2
ROLE_ADMIN = 4

class Message(db.Model):
    __table_args__ = {'sqlite_autoincrement': True}

    id = db.Column(db.Integer, primary_key=True, unique=True)
    user_email = db.Column(db.String(120), index=True)
    dest_email = db.Column(db.String(120), index=True)
    message = db.Column(db.String(2000), index=True)
    timestamp = db.Column(db.Float, index=True)

    def serialize(self):
        return {
            'from': self.user_email,
            'to': self.dest_email,
            'timestamp': self.timestamp,
            'message': self.message
        }


class Session(db.Model):
    token = db.Column(db.String(128), primary_key=True, index=True, unique=True)
    timestamp = db.Column(db.Integer)
    user = relationship('User', backref=backref('sessions', order_by=timestamp))
    id = db.Column(db.Integer, db.ForeignKey('user.id'), index=True)

    def is_valid(self):
        return self.timestamp >= int(datetime.utcnow().timestamp())


class Representative(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(60), index=True)
    email = db.Column(db.String(120), index=True, unique=True)
    tel_number = db.Column(db.String(30), index=True)
    company_id = db.Column(db.Integer, index=True)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)

    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(30), index=True)
    tel_number = db.Column(db.String(30), index=True)
    city = db.Column(db.String(60), index=True)
    role = db.Column(db.SmallInteger, default=ROLE_CAR, index=True)

    name = db.Column(db.String(60), index=True)
    surname = db.Column(db.String(60), index=True)
    middle_name = db.Column(db.String(60), index=True)
    birthday = db.Column(db.Date, index=True)
    company_name = db.Column(db.String(120), index=True)

    def is_admin(self):
        return self.email == 'admin'

    def get_id(self):       # wtf is it needed for
        return self.id

    def __repr__(self):
        return '<User %r>' % (self.email)



######################### GPS ##########################

class Point(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, index=True)
    latitude = db.Column(db.Float, index=True)
    longtitude = db.Column(db.Float, index=True)
    altitude = db.Column(db.Float, index=True)
    accuracy = db.Column(db.SmallInteger, index=True)
    timestamp = db.Column(db.Integer, index=True)

    def __str__(self):
        return ("Point id: {}\n".format(str(self.id)) +
                "User id: {}\n".format(str(self.user_id)) +
                "Coordinates: ({} | {})\n".format(str(self.latitude),
                                                  str(self.longtitude)) +
                "Altitude: {}\n".format(str(self.altitude)) +
                "Accuracy: {}\n".format(str(self.accuracy)) +
                "Timestamp: {}\n".format(str(self.timestamp)))
