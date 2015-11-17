import os
basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

UPLOAD_FOLDER = os.path.join(basedir, 'app/static/img')

CSRF_ENABLED = True
SECRET_KEY = 'SECRET_KEY_DBG'

# PERMANENT_SESSION_LIFETIME = datetime.timedelta(minutes=30)
