import os
from config import basedir

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

from app.api.auth import api_auth
app.register_blueprint(api_auth)

# lm = LoginManager()
# lm.init_app(app)
# lm.session_protection = "strong"
# lm.login_view = 'index'

from app import views, models
