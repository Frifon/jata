from app import db
from flask import g
from hashlib import md5
from random import randint
from datetime import datetime

ROLE_CAR = 1
ROLE_ADD = 2
ROLE_ADMIN = 4


class Session(db.Model):
    token = db.Column(db.String(128), primary_key=True, index=True, unique=True)
    id = db.Column(db.Integer, index=True)
    timestamp = db.Column(db.Integer, index=True)

    def is_valid(self):
        return self.timestamp >= int(datetime.utcnow().timestamp())


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(30), index=True)
    tel_number = db.Column(db.String(30), index=True)
    city = db.Column(db.String(60), index=True)
    role = db.Column(db.SmallInteger, default=ROLE_CAR)

    name = db.Column(db.String(60), index=True)
    surname = db.Column(db.String(60), index=True)
    middle_name = db.Column(db.String(60), index=True)
    birthday = db.Column(db.Date, index=True)
    company = db.Column(db.String(120), index=True)
    company_type = db.Column(db.Integer, index=True)

    def is_authenticated(self):
        session = g.session
        if session and not session.is_valid():
            db.session.delete(session)
            db.session.commit()
        return session and session.is_valid()

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    def __repr__(self):
        return '<User %r>' % (self.email)


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
