# -*- coding: utf-8 -*-

import sys
import inspect
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import app.models
from flask.ext.superadmin import Admin, model

app = Flask(__name__)
app.config.from_object('config')


db = SQLAlchemy(app)


if __name__ == '__main__':
    admin = Admin(app, 'DB ADMIN')

    for name, obj in inspect.getmembers(sys.modules['app.models']):
        if inspect.isclass(obj) and hasattr(obj, 'query'):
            admin.register(obj, session=db.session)

    app.debug = True
    app.run('0.0.0.0', 8000)
