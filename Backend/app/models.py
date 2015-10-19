from app import db
from hashlib import md5
from random import randint

ROLE_CAR = 1
ROLE_ADD = 2 
ROLE_ADMIN = 4

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(120), index = True, unique = True)
    password = db.Column(db.String(30), index = True)
    role = db.Column(db.SmallInteger, default = ROLE_CAR)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    def __repr__(self):
        return '<User %r>' % (self.email)



