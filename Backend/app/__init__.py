import os
from config import basedir

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

# lm = LoginManager()
# lm.init_app(app)
# lm.session_protection = "strong"
# lm.login_view = 'index'

from app import views, models
