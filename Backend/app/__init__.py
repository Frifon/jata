import sys

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

if sys.version_info[0] == 3:
    from app.api.auth import api_auth
    app.register_blueprint(api_auth)

from app.api.chat import api_chat
app.register_blueprint(api_chat)

from app.api.gps import api_gps
app.register_blueprint(api_gps)

if sys.version_info[0] == 3:
    from app.api.sms import api_sms
    app.register_blueprint(api_sms)

# lm = LoginManager()
# lm.init_app(app)
# lm.session_protection = "strong"
# lm.login_view = 'index'

from app import views, models