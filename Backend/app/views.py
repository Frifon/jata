# -*- coding: utf-8 -*-
from flask import render_template, redirect, url_for, request, g, jsonify, make_response, abort
from werkzeug import datastructures
import datetime, json, sys, inspect

from app import app, db
from app.forms import RegForm
from app.models import User, Representative
from app.decorators import login_required, after_this_request



# def make_internal_redirect(path, method, data):
#     headers = datastructures.Headers()
#     if method is 'POST':
#         headers.add('Content-Type', 'application/x-www-form-urlencoded')
#     with app.test_request_context(path, method=method, data=data, headers=headers):
#         return app.full_dispatch_request()


@app.route('/login', methods = ['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    rv = app.test_client().post('/api/auth/login', data={'email': email, 'password': password}, follow_redirects=True)
    result = json.loads(rv.data.decode('unicode_escape'))
    if result is None or not 'data' in result:
        return redirect(url_for('index'))

    @after_this_request
    def add_cookie_token(response):
        response.set_cookie('token', result['data']['token'])

    return redirect(url_for('index'))


@app.route('/logout', methods = ['GET'])
def logout():
    rv = app.test_client().post('/api/auth/logout', data={'token': g.token}, follow_redirects=True)
    result = json.loads(rv.data.decode('unicode_escape'))
    return redirect(url_for('index'))


@app.route('/index', methods = ['GET', 'POST'])
@app.route('/', methods = ['GET', 'POST'])
def index():
    return base_render("index.html", title=u"Jata")


@app.route('/change_password', methods = ['POST'])
@login_required
def change_password():

    def construct_response(code, message):
        return {'code': code, 'message': message}
    def incorrect_param(p):
        return construct_response(1, 'Incorrect parameter: {0}'.format(p))
    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))

    old_password = request.form.get('old-password')
    new_password = request.form.get('new-password')
    new_password_confirmation = request.form.get('new-password-confirmation')

    if not old_password:
        return make_response(jsonify(missing_param('old_password')), 400)
    if not new_password:
        return make_response(jsonify(missing_param('new_password')), 400)
    if not new_password_confirmation:
        return make_response(jsonify(missing_param('new_password_confirmation')), 400)

    if old_password != g.user.password:
        return make_response(jsonify(incorrect_param('old_password')), 400)
    if new_password != new_password_confirmation:
        return make_response(jsonify(incorrect_param('new_password_confirmation')), 400)

    g.user.password = new_password
    db.session.commit()

    return make_response(jsonify(construct_response(0, 'OK')), 200)


@app.route('/profile')
@login_required
def profile():
    if g.user.role == 2:
        representatives = Representative.query.filter_by(company_id=g.session.id).all()
        return render_template('profile.html', representatives=representatives)
    else:
        return render_template('profile.html')

@app.route('/favicon.ico')
def favicon_ico():
    return ''

def base_render(*args, **kwargs):
    return render_template(*args, reg_form=RegForm(), **kwargs)


@app.route('/update_profile/<int:role>', methods = ['POST'])
@login_required
def update_profile(role):
    
    def construct_response(code, message):
        return {'code': code, 'message': message}
    def incorrect_param(p):
        return construct_response(1, 'Incorrect parameter: {0}'.format(p))
    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))

    if role == 1:
        surname = request.form.get('user-lastname')
        name = request.form.get('user-firstname')
        middle_name = request.form.get('user-middlename')
        birthday = request.form.get('user-birthday')
        tel_number = request.form.get('user-phone')
        email = request.form.get('user-email')
        
        if not surname:
            return make_response(jsonify(missing_param('surname')), 400)
        if not name:
            return make_response(jsonify(missing_param('name')), 400)
        if not middle_name:
            return make_response(jsonify(missing_param('middle_name')), 400)
        if not birthday:
            return make_response(jsonify(missing_param('birthday')), 400)
        if not tel_number:
            return make_response(jsonify(missing_param('tel_number')), 400)
        if not email:
            return make_response(jsonify(missing_param('email')), 400)

        g.user.surname = surname
        g.user.name = name
        g.user.middle_name = middle_name
        birthday = list(map(int, birthday.split('-')))
        g.user.birthday = datetime.date(birthday[2], birthday[1], birthday[0])
        g.user.tel_number = tel_number
        g.user.email = email
        db.session.commit()
        return make_response(jsonify(construct_response(0, 'OK')), 200)

    elif role == 2:
        company_name = request.form.get('company-name')
        company_representative_name = request.form.get('company-representative-name')
        company_representative_email = request.form.get('company-representative-email')
        company_representative_phone = request.form.get('company-representative-phone')

        if not company_name:
            return make_response(jsonify(missing_param('company_name')), 400)
        if not company_representative_name:
            return make_response(jsonify(missing_param('company_representative_name')), 400)
        if not company_representative_phone:
            return make_response(jsonify(missing_param('company_representative_phone')), 400)
        if not company_representative_email:
            return make_response(jsonify(missing_param('company_representative_email')), 400)
        if not company_name:
            return make_response(jsonify(missing_param('company_name')), 400)

        g.user.company_name = company_name

        new_representative = Representative(
            email=company_representative_email,
            tel_number=company_representative_phone,
            name=company_representative_name,
            company_id=g.user.id)

        db.session.add(new_representative)
        db.session.commit()
        return make_response(jsonify(construct_response(0, 'OK')), 200)
    else:
        return make_response(jsonify(incorrect_param('role')), 400)


@app.route('/chat')
@login_required
def chat():
    users = []
    if g.user:
        if g.user.is_admin():
            users = [user.email for user in User.query.all() if not(user.is_admin())]
        else:
            users = [u"Техническая поддержка"]
    return render_template('chat.html', users=users)

@app.route('/ts')
@login_required
def ts():
    return render_template('myts-show-all-ts.html')

@app.route('/add_ts')
@login_required
def add_ts():
    return render_template('myts-add-ts.html')

@app.route('/edit_ts')
@login_required
def edit_ts():
    return render_template('myts-show-edit-ts.html')

@app.route('/db')
def db_admin():
    tables = []
    for name, obj in inspect.getmembers(sys.modules['app.models']):
        if inspect.isclass(obj) and hasattr(obj, 'query'):
            tables.append([obj.__name__, obj.query.all()])
    return render_template('db_admin.html', tables=tables)



#################### ERROR HANDLERS ####################

@app.errorhandler(405)
def error405(error):
    url = str(request.base_url)
    if not 'api' in url:
        return redirect(url_for('index'))
    return make_response(jsonify({'error': 'Method not allowed',
                                  'code': 405}))


@app.errorhandler(404)
def error404(error):
    url = str(request.base_url)
    if not 'api' in url:
        return redirect(url_for('index'))
    return make_response(jsonify({'error': 'Method not found',
                                  'code': 404}))