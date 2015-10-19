from flask.ext.wtf import Form
from wtforms import TextField, BooleanField, PasswordField, HiddenField
import wtforms.validators as validators 

class LoginForm(Form):
    email = TextField('email')
    password = PasswordField('password')

class RegForm(Form):
    email = TextField('email')
    password = PasswordField('password')