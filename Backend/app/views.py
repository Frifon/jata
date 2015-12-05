# -*- coding: utf-8 -*-

import os
import json
import datetime
from werkzeug import secure_filename
from flask import render_template, redirect, url_for, request, g, jsonify
from flask import make_response

from app import app, db, allowed_file
from app.forms import RegForm
from app.models import User, Representative, Car, Route, Role
from app.decorators import login_required, after_this_request


# def make_internal_redirect(path, method, data):
#     headers = datastructures.Headers()
#     if method is 'POST':
#         headers.add('Content-Type', 'application/x-www-form-urlencoded')
#     with app.test_request_context(
#             path, method=method, data=data, headers=headers):
#         return app.full_dispatch_request()


@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    rv = app.test_client().post(
        '/api/auth/login',
        data={'email': email, 'password': password},
        follow_redirects=True)

    result = json.loads(rv.data.decode('unicode_escape'))
    if result is None or 'data' not in result:
        return redirect(url_for('index'))

    @after_this_request
    def add_cookie_token(response):
        response.set_cookie('token', result['data']['token'])

    return redirect(url_for('index'))


@app.route('/logout', methods=['GET'])
def logout():
    rv = app.test_client().post(
        '/api/auth/logout', data={'token': g.token}, follow_redirects=True)
    result = json.loads(rv.data.decode('unicode_escape'))
    return redirect(url_for('index'))


@app.route('/index', methods=['GET', 'POST'])
@app.route('/', methods=['GET', 'POST'])
def index():
    return base_render("index.html", title=u"Jata")


@app.route('/change_password', methods=['POST'])
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
        return make_response(
            jsonify(missing_param('new_password_confirmation')), 400)

    if old_password != g.user.password:
        return make_response(jsonify(incorrect_param('old_password')), 400)
    if new_password != new_password_confirmation:
        return make_response(
            jsonify(incorrect_param('new_password_confirmation')), 400)

    g.user.password = new_password
    db.session.commit()

    return make_response(jsonify(construct_response(0, 'OK')), 200)


@app.route('/profile')
@login_required
def profile():
    if g.user.role & Role['add']:
        representatives = Representative.query.filter_by(
            company_id=g.session.id).all()
        return render_template('profile.html', representatives=representatives)
    else:
        return render_template('profile.html')


@app.route('/favicon.ico')
def favicon_ico():
    return ''


def base_render(*args, **kwargs):
    return render_template(*args, reg_form=RegForm(), **kwargs)


@app.route('/update_profile/<int:role>', methods=['POST'])
@login_required
def update_profile(role):

    def construct_response(code, message):
        return {'code': code, 'message': message}

    def incorrect_param(p):
        return construct_response(1, 'Incorrect parameter: {0}'.format(p))

    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))

    if role & Role['car']:
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

    elif role & Role['add']:
        company_name = request.form.get('company-name')
        company_representative_name = request.form.get(
            'company-representative-name')
        company_representative_email = request.form.get(
            'company-representative-email')
        company_representative_phone = request.form.get(
            'company-representative-phone')

        if not company_name:
            return make_response(jsonify(missing_param('company_name')), 400)
        if not company_representative_name:
            return make_response(
                jsonify(missing_param('company_representative_name')), 400)
        if not company_representative_phone:
            return make_response(
                jsonify(missing_param('company_representative_phone')), 400)
        if not company_representative_email:
            return make_response(
                jsonify(missing_param('company_representative_email')), 400)
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


@app.route('/add_car', methods=['POST'])
@login_required
def add_car():

    def construct_response(code, message):
        return {'code': code, 'message': message}

    def incorrect_param(p):
        return construct_response(1, 'Incorrect parameter: {0}'.format(p))

    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))

    car_type = request.form.get('ts_type')
    car_usage_type = request.form.get('ts_usagetype')
    car_activities = request.form.get('ts_activities')
    car_brand = request.form.get('ts_make')
    car_model = request.form.get('ts_model')
    car_year = request.form.get('ts_made')
    car_color = request.form.get('ts_color')

    car_photo = request.files['file']

    if not car_type:
        return make_response(jsonify(missing_param('car_type')), 400)
    if not car_usage_type:
        return make_response(jsonify(missing_param('car_usage_type')), 400)
    if not car_activities:
        return make_response(jsonify(missing_param('car_activities')), 400)
    if not car_brand:
        return make_response(jsonify(missing_param('car_brand')), 400)
    if not car_model:
        return make_response(jsonify(missing_param('car_model')), 400)
    if not car_year:
        return make_response(jsonify(missing_param('car_year')), 400)
    if not car_color:
        return make_response(jsonify(missing_param('car_color')), 400)

    if not car_photo:
        return make_response(jsonify(missing_param('car_photo')), 400)

    if not allowed_file(car_photo.filename):
        return make_response(jsonify(incorrect_param('car_photo')), 400)

    filename = secure_filename(car_photo.filename)
    car_photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    new_car = Car(
        car_type=car_type,
        car_usage_type=car_usage_type,
        car_activities=car_activities,
        car_brand=car_brand,
        car_model=car_model,
        car_year=car_year,
        car_color=car_color,
        user_id=g.user.id,
        car_photo='img/' + filename)

    db.session.add(new_car)
    db.session.commit()

    return make_response(jsonify(construct_response(0, 'OK')), 200)


@app.route('/chat')
@login_required
def chat():
    users = []
    if g.user:
        if g.user.is_admin():
            all_users = User.query.all()
            users = [user.email for user in all_users if not(user.is_admin())]
        else:
            users = [u"Техническая поддержка"]
    return render_template('chat.html', users=users)


@app.route('/ts')
@login_required
def ts():
    cars = Car.query.filter_by(user_id=g.session.id).all()
    return render_template('myts-show-all-ts.html', cars=cars)


@app.route('/add_ts')
@login_required
def add_ts():
    return render_template('myts-add-ts.html')


@app.route('/edit_ts/<int:car_id>')
@login_required
def edit_ts(car_id):
    car = Car.query.filter_by(id=car_id).all()[0]
    return render_template('myts-show-edit-ts.html', car=car)


@app.route('/delete_car/<int:car_id>', methods=['POST'])
@login_required
def delete_car(car_id):

    def construct_response(code, message):
        return {'code': code, 'message': message}

    def incorrect_param(p):
        return construct_response(1, 'Incorrect parameter: {0}'.format(p))

    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))

    car = Car.query.filter_by(id=car_id).all()[0]
    db.session.delete(car)
    db.session.commit()

    return make_response(jsonify(construct_response(0, 'OK')), 200)


@app.route('/change_car/<int:car_id>', methods=['POST'])
@login_required
def change_car(car_id):

    def construct_response(code, message):
        return {'code': code, 'message': message}

    def incorrect_param(p):
        return construct_response(1, 'Incorrect parameter: {0}'.format(p))

    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))

    car_type = request.form.get('ts_type')
    car_usage_type = request.form.get('ts_usagetype')
    car_activities = request.form.get('ts_activities')
    car_brand = request.form.get('ts_make')
    car_model = request.form.get('ts_model')
    car_year = request.form.get('ts_made')
    car_color = request.form.get('ts_color')

    car_photo = request.files['file']

    if not car_type:
        return make_response(jsonify(missing_param('car_type')), 400)
    if not car_usage_type:
        return make_response(jsonify(missing_param('car_usage_type')), 400)
    if not car_activities:
        return make_response(jsonify(missing_param('car_activities')), 400)
    if not car_brand:
        return make_response(jsonify(missing_param('car_brand')), 400)
    if not car_model:
        return make_response(jsonify(missing_param('car_model')), 400)
    if not car_year:
        return make_response(jsonify(missing_param('car_year')), 400)
    if not car_color:
        return make_response(jsonify(missing_param('car_color')), 400)

    if not car_photo:
        return make_response(jsonify(missing_param('car_photo')), 400)

    if not allowed_file(car_photo.filename):
        return make_response(jsonify(incorrect_param('car_photo')), 400)

    filename = secure_filename(car_photo.filename)
    car_photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    car = Car.query.filter_by(id=car_id).all()[0]

    car.car_type = car_type
    car.car_usage_type = car_usage_type
    car.car_activities = car_activities
    car.car_brand = car_brand
    car.car_model = car_model
    car.car_year = car_year
    car.car_color = car_color
    car.user_id = g.user.id
    car.car_photo = 'img/' + filename

    db.session.commit()

    return make_response(jsonify(construct_response(0, 'OK')), 200)


@app.route('/routes')
def routes():
    cars = Car.query.filter_by(user_id=g.session.id).all()
    return render_template('marshruty.html', cars=cars)


@app.route('/add_route', methods=['POST'])
@login_required
def add_route():

    def construct_response(code, message):
        return {'code': code, 'message': message}

    def incorrect_param(p):
        return construct_response(1, 'Incorrect parameter: {0}'.format(p))

    def missing_param(p):
        return construct_response(1, 'Missing parameter: {0}'.format(p))

    car_id = request.form.get('car_id')
    route_name = request.form.get('route_name')
    route_type = request.form.get('route_type')

    if not car_id:
        return make_response(jsonify(missing_param('car_id')), 400)
    if not route_name:
        return make_response(jsonify(missing_param('route_name')), 400)
    if not route_type:
        return make_response(jsonify(missing_param('route_type')), 400)

    if route_type == "1":

        route_fixed_type = request.form.get('ts_route_direction')
        if not route_fixed_type:
            return make_response(jsonify(missing_param('route_fixed_type')), 400)

        if route_fixed_type == "one_direction":
            route_fixed_type = 0
        else:
            route_fixed_type = 1

        if route_fixed_type == 0:

            start_point_id = request.form.get('ts_route_start_var')
            if not start_point_id:
                return make_response(jsonify(missing_param('start_point_id')), 400)

            finish_point_id = request.form.get('ts_route_finish_var')
            if not finish_point_id:
                return make_response(jsonify(missing_param('finish_point_id')), 400)

            route_days = request.form.get('ts_route_days')
            if not route_days:
                return make_response(jsonify(missing_param('route_days')), 400)

            if route_days == "ts_route_days_weekdays":
                route_days = 0
            elif route_days == "ts_route_days_weekend":
                route_days = 1
            elif route_days == "ts_route_days_alldays":
                route_days = 2
            else:
                route_days = 3

            new_route = Route(
                user_id=g.user.id,
                car_id=int(car_id),
                route_name=route_name,
                route_type=int(route_type),
                route_fixed_type=route_fixed_type,
                start_point_id=int(start_point_id),
                finish_point_id=int(finish_point_id),
                route_days=route_days)

            db.session.add(new_route)
            db.session.commit()

        else:
            pass

    elif route_type == "2":
        new_route = Route(
            user_id=g.user.id,
            car_id=int(car_id),
            route_name=route_name,
            route_type=int(route_type))

        db.session.add(new_route)
        db.session.commit()
    else:
        new_route = Route(
            user_id=g.user.id,
            car_id=int(car_id),
            route_name=route_name,
            route_type=int(route_type))

        db.session.add(new_route)
        db.session.commit()

    return make_response(jsonify(construct_response(0, 'OK')), 200)

# ################### ERROR HANDLERS ####################
@app.errorhandler(405)
def error405(error):
    url = str(request.base_url)
    if 'api' not in url:
        return redirect(url_for('index'))
    return make_response(jsonify({'error': 'Method not allowed',
                                  'code': 405}))


@app.errorhandler(404)
def error404(error):
    url = str(request.base_url)
    if 'api' not in url:
        return redirect(url_for('index'))
    return make_response(jsonify({'error': 'Method not found',
                                  'code': 404}))
