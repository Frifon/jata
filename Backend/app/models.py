from app import db
from hashlib import md5
from random import randint
from datetime import datetime

ROLE_CAR = 1
ROLE_ADD = 2 
ROLE_ADMIN = 4

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    timestamp = db.Column(db.Integer, index=True)
    token = db.Column(db.String(128), index=True)

    def is_valid(self):
        return self.timestamp >= int(datetime.utcnow().timestamp())


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(30), index=True)
    tel_number = db.Column(db.String(30), index=True)
    city = db.Column(db.String(60), index=True)
    role = db.Column(db.SmallInteger, default=ROLE_CAR)

    def is_authenticated(self):
        session = Session.query.filter_by(id=self.id).first()
        if not session:
            return False
        return session.is_valid()

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    def __repr__(self):
        return '<User %r>' % (self.email)



