# -*- coding: utf-8 -*-

from app import app, db
from app.models import Car, Route
from flask import g, render_template, request, jsonify, make_response, Blueprint
from app.decorators import login_required

api_routes = Blueprint('api_routes', __name__)


@app.route('/api/routes/show', methods=['GET'])
def routes():
    cars = Car.query.filter_by(user_id=g.session.id).all()
    return render_template('marshruty.html', cars=cars)


@app.route('/api/routes/add', methods=['POST'])
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
            return make_response(
                jsonify(missing_param('route_fixed_type')), 400)

        if route_fixed_type == "one_direction":
            route_fixed_type = 0
        else:
            route_fixed_type = 1

        if route_fixed_type == 0:

            start_point_id = request.form.get('ts_route_start_var')
            if not start_point_id:
                return make_response(
                    jsonify(missing_param('start_point_id')), 400)

            finish_point_id = request.form.get('ts_route_finish_var')
            if not finish_point_id:
                return make_response(
                    jsonify(missing_param('finish_point_id')), 400)

            route_days = request.form.get('ts_route_days')
            if not route_days:
                return make_response(
                    jsonify(missing_param('route_days')), 400)

            if route_days == "ts_route_days_weekdays":
                route_days = 0
            elif route_days == "ts_route_days_weekend":
                route_days = 1
            elif route_days == "ts_route_days_alldays":
                route_days = 2
            else:
                route_days = 3

            if route_days == 3:

                route_monday = request.form.getlist(
                    'ts_route_days_custom_mon')
                route_monday_start = request.form.get(
                    'days_mon_start')
                route_monday_end = request.form.get(
                    'days_mon_end')

                route_tuesday = request.form.getlist(
                    'ts_route_days_custom_tue')
                route_tuesday_start = request.form.get(
                    'days_tue_start')
                route_tuesday_end = request.form.get(
                    'days_tue_end')

                route_wednesday = request.form.getlist(
                    'ts_route_days_custom_wed')
                route_wednesday_start = request.form.get(
                    'days_wed_start')
                route_wednesday_end = request.form.get(
                    'days_wed_end')

                route_thursday = request.form.getlist(
                    'ts_route_days_custom_thu')
                route_thursday_start = request.form.get(
                    'days_thu_start')
                route_thursday_end = request.form.get(
                    'days_thu_end')

                route_friday = request.form.getlist(
                    'ts_route_days_custom_fri')
                route_friday_start = request.form.get(
                    'days_fri_start')
                route_friday_end = request.form.get(
                    'days_fri_end')

                route_saturday = request.form.getlist(
                    'ts_route_days_custom_sat')
                route_saturday_start = request.form.get(
                    'days_sat_start')
                route_saturday_end = request.form.get(
                    'days_sat_end')

                route_sunday = request.form.getlist(
                    'ts_route_days_custom_sun')
                route_sunday_start = request.form.get(
                    'days_sun_start')
                route_sunday_end = request.form.get(
                    'days_sun_end')

                comment = request.form.get(
                    'ts_route_comment')
                if not comment:
                    return make_response(
                        jsonify(missing_param('comment')), 400)

                new_route = Route(
                    user_id=g.user.id,
                    car_id=int(car_id),
                    route_name=route_name,
                    route_type=int(route_type),
                    route_fixed_type=route_fixed_type,
                    start_point_id=int(start_point_id),
                    finish_point_id=int(finish_point_id),
                    route_days=route_days,
                    route_monday=int(bool(route_monday)),
                    route_monday_start=route_monday_start,
                    route_monday_end=route_monday_end,
                    route_tuesday=int(bool(route_tuesday)),
                    route_tuesday_start=route_tuesday_start,
                    route_tuesday_end=route_tuesday_end,
                    route_wednesday=int(bool(route_wednesday)),
                    route_wednesday_start=route_wednesday_start,
                    route_wednesday_end=route_wednesday_end,
                    route_thursday=int(bool(route_thursday)),
                    route_thursday_start=route_thursday_start,
                    route_thursday_end=route_thursday_end,
                    route_friday=int(bool(route_friday)),
                    route_friday_start=route_friday_start,
                    route_friday_end=route_friday_end,
                    route_saturday=int(bool(route_saturday)),
                    route_saturday_start=route_saturday_start,
                    route_saturday_end=route_saturday_end,
                    route_sunday=int(bool(route_sunday)),
                    route_sunday_start=route_sunday_start,
                    route_sunday_end=route_sunday_end,
                    comment=comment)

                print(str(new_route))

                db.session.add(new_route)
                db.session.commit()

            else:
                route_time_start = request.form.get('route_time_start')
                if not route_time_start:
                    return make_response(
                        jsonify(missing_param('route_time_start')), 400)

                route_time_end = request.form.get('route_time_end')
                if not route_time_end:
                    return make_response(
                        jsonify(missing_param('route_time_end')), 400)

                comment = request.form.get('ts_route_comment')
                if not comment:
                    return make_response(
                        jsonify(missing_param('comment')), 400)

                new_route = Route(
                    user_id=g.user.id,
                    car_id=int(car_id),
                    route_name=route_name,
                    route_type=int(route_type),
                    route_fixed_type=route_fixed_type,
                    start_point_id=int(start_point_id),
                    finish_point_id=int(finish_point_id),
                    route_days=route_days,
                    route_time_start=route_time_start,
                    route_time_end=route_time_end,
                    comment=comment)

                print(str(new_route))

                db.session.add(new_route)
                db.session.commit()
        else:
            start_point_id = request.form.get('ts_route_start_var')
            if not start_point_id:
                return make_response(
                    jsonify(missing_param('start_point_id')), 400)

            finish_point_id = request.form.get('ts_route_finish_var')
            if not finish_point_id:
                return make_response(
                    jsonify(missing_param('finish_point_id')), 400)

            route_days = request.form.get('ts_route_days')
            if not route_days:
                return make_response(
                    jsonify(missing_param('route_days')), 400)

            if route_days == "ts_route_days_weekdays":
                route_days = 0
            elif route_days == "ts_route_days_weekend":
                route_days = 1
            elif route_days == "ts_route_days_alldays":
                route_days = 2
            else:
                route_days = 3

            if route_days == 3:

                route_monday = request.form.getlist(
                    'ts_route_days_custom_mon')
                route_monday_start = request.form.get(
                    'days_mon_start')
                route_monday_end = request.form.get(
                    'days_mon_end')

                route_tuesday = request.form.getlist(
                    'ts_route_days_custom_tue')
                route_tuesday_start = request.form.get(
                    'days_tue_start')
                route_tuesday_end = request.form.get(
                    'days_tue_end')

                route_wednesday = request.form.getlist(
                    'ts_route_days_custom_wed')
                route_wednesday_start = request.form.get(
                    'days_wed_start')
                route_wednesday_end = request.form.get(
                    'days_wed_end')

                route_thursday = request.form.getlist(
                    'ts_route_days_custom_thu')
                route_thursday_start = request.form.get(
                    'days_thu_start')
                route_thursday_end = request.form.get(
                    'days_thu_end')

                route_friday = request.form.getlist(
                    'ts_route_days_custom_fri')
                route_friday_start = request.form.get(
                    'days_fri_start')
                route_friday_end = request.form.get(
                    'days_fri_end')

                route_saturday = request.form.getlist(
                    'ts_route_days_custom_sat')
                route_saturday_start = request.form.get(
                    'days_sat_start')
                route_saturday_end = request.form.get(
                    'days_sat_end')

                route_sunday = request.form.getlist(
                    'ts_route_days_custom_sun')
                route_sunday_start = request.form.get(
                    'days_sun_start')
                route_sunday_end = request.form.get(
                    'days_sun_end')

                route_monday_back = request.form.getlist(
                    'ts_reverse_route_days_custom_mon')
                route_monday_start_back = request.form.get(
                    'days_mon_start_2')
                route_monday_end_back = request.form.get(
                    'days_mon_end_2')

                route_tuesday_back = request.form.getlist(
                    'ts_reverse_route_days_custom_tue')
                route_tuesday_start_back = request.form.get(
                    'days_tue_start_2')
                route_tuesday_end_back = request.form.get(
                    'days_tue_end_2')

                route_wednesday_back = request.form.getlist(
                    'ts_reverse_route_days_custom_wed')
                route_wednesday_start_back = request.form.get(
                    'days_wed_start_2')
                route_wednesday_end_back = request.form.get(
                    'days_wed_end_2')

                route_thursday_back = request.form.getlist(
                    'ts_reverse_route_days_custom_thu')
                route_thursday_start_back = request.form.get(
                    'days_thu_start_2')
                route_thursday_end_back = request.form.get(
                    'days_thu_end_2')

                route_friday_back = request.form.getlist(
                    'ts_reverse_route_days_custom_fri')
                route_friday_start_back = request.form.get(
                    'days_fri_start_2')
                route_friday_end_back = request.form.get(
                    'days_fri_end_2')

                route_saturday_back = request.form.getlist(
                    'ts_reverse_route_days_custom_sat')
                route_saturday_start_back = request.form.get(
                    'days_sat_start_2')
                route_saturday_end_back = request.form.get(
                    'days_sat_end_2')

                route_sunday_back = request.form.getlist(
                    'ts_reverse_route_days_custom_sun')
                route_sunday_start_back = request.form.get(
                    'days_sun_start_2')
                route_sunday_end_back = request.form.get(
                    'days_sun_end_2')

                comment = request.form.get(
                    'ts_route_comment')
                if not comment:
                    return make_response(
                        jsonify(missing_param('comment')), 400)

                new_route = Route(
                    user_id=g.user.id,
                    car_id=int(car_id),
                    route_name=route_name,
                    route_type=int(route_type),
                    route_fixed_type=route_fixed_type,
                    start_point_id=int(start_point_id),
                    finish_point_id=int(finish_point_id),
                    route_days=route_days,
                    route_monday=int(bool(route_monday)),
                    route_monday_start=route_monday_start,
                    route_monday_end=route_monday_end,
                    route_tuesday=int(bool(route_tuesday)),
                    route_tuesday_start=route_tuesday_start,
                    route_tuesday_end=route_tuesday_end,
                    route_wednesday=int(bool(route_wednesday)),
                    route_wednesday_start=route_wednesday_start,
                    route_wednesday_end=route_wednesday_end,
                    route_thursday=int(bool(route_thursday)),
                    route_thursday_start=route_thursday_start,
                    route_thursday_end=route_thursday_end,
                    route_friday=int(bool(route_friday)),
                    route_friday_start=route_friday_start,
                    route_friday_end=route_friday_end,
                    route_saturday=int(bool(route_saturday)),
                    route_saturday_start=route_saturday_start,
                    route_saturday_end=route_saturday_end,
                    route_sunday=int(bool(route_sunday)),
                    route_sunday_start=route_sunday_start,
                    route_sunday_end=route_sunday_end,
                    route_monday_back=int(bool(route_monday_back)),
                    route_monday_start_back=route_monday_start_back,
                    route_monday_end_back=route_monday_end_back,
                    route_tuesday_back=int(bool(route_tuesday_back)),
                    route_tuesday_start_back=route_tuesday_start_back,
                    route_tuesday_end_back=route_tuesday_end_back,
                    route_wednesday_back=int(bool(route_wednesday_back)),
                    route_wednesday_start_back=route_wednesday_start_back,
                    route_wednesday_end_back=route_wednesday_end_back,
                    route_thursday_back=int(bool(route_thursday_back)),
                    route_thursday_start_back=route_thursday_start_back,
                    route_thursday_end_back=route_thursday_end_back,
                    route_friday_back=int(bool(route_friday_back)),
                    route_friday_start_back=route_friday_start_back,
                    route_friday_end_back=route_friday_end_back,
                    route_saturday_back=int(bool(route_saturday_back)),
                    route_saturday_start_back=route_saturday_start_back,
                    route_saturday_end_back=route_saturday_end_back,
                    route_sunday_back=int(bool(route_sunday_back)),
                    route_sunday_start_back=route_sunday_start_back,
                    route_sunday_end_back=route_sunday_end_back,
                    comment=comment)

                print(str(new_route))

                db.session.add(new_route)
                db.session.commit()

            else:
                route_time_start = request.form.get(
                    'route_time_start')
                if not route_time_start:
                    return make_response(
                        jsonify(missing_param('route_time_start')), 400)

                route_time_end = request.form.get(
                    'route_time_end')
                if not route_time_end:
                    return make_response(
                        jsonify(missing_param('route_time_end')), 400)

                route_time_start_back = request.form.get(
                    'route_time_start_back')
                if not route_time_start_back:
                    return make_response(
                        jsonify(missing_param('route_time_start_back')), 400)

                route_time_end_back = request.form.get(
                    'route_time_end_back')
                if not route_time_end_back:
                    return make_response(
                        jsonify(missing_param('route_time_end_back')), 400)

                comment = request.form.get(
                    'ts_route_comment')
                if not comment:
                    return make_response(
                        jsonify(missing_param('comment')), 400)

                new_route = Route(
                    user_id=g.user.id,
                    car_id=int(car_id),
                    route_name=route_name,
                    route_type=int(route_type),
                    route_fixed_type=route_fixed_type,
                    start_point_id=int(start_point_id),
                    finish_point_id=int(finish_point_id),
                    route_days=route_days,
                    route_time_start=route_time_start,
                    route_time_end=route_time_end,
                    route_time_start_back=route_time_start,
                    route_time_end_back=route_time_end,
                    comment=comment)

                print(str(new_route))

                db.session.add(new_route)
                db.session.commit()

    elif route_type == "2":

        district = request.form.get('ts_route_district')
        if not district:
            return make_response(
                jsonify(missing_param('district')), 400)

        route_days = request.form.get('ts_route_district_days')
        if not route_days:
            return make_response(
                jsonify(missing_param('route_days')), 400)

        if route_days == "ts_route_district_days_weekdays":
            route_days = 0
        elif route_days == "ts_route_district_days_weekend":
            route_days = 1
        elif route_days == "ts_route_district_days_alldays":
            route_days = 2
        else:
            route_days = 3

        if route_days == 3:

            route_monday = request.form.getlist(
                'ts_route_district_days_custom_mon')
            route_monday_start = request.form.get(
                'days_mon_start_district')
            route_monday_end = request.form.get(
                'days_mon_end_district')

            route_tuesday = request.form.getlist(
                'ts_route_district_days_custom_tue')
            route_tuesday_start = request.form.get(
                'days_tue_start_district')
            route_tuesday_end = request.form.get(
                'days_tue_end_district')

            route_wednesday = request.form.getlist(
                'ts_route_district_days_custom_wed')
            route_wednesday_start = request.form.get(
                'days_wed_start_district')
            route_wednesday_end = request.form.get(
                'days_wed_end_district')

            route_thursday = request.form.getlist(
                'ts_route_district_days_custom_thu')
            route_thursday_start = request.form.get(
                'days_thu_start_district')
            route_thursday_end = request.form.get(
                'days_thu_end_district')

            route_friday = request.form.getlist(
                'ts_route_district_days_custom_fri')
            route_friday_start = request.form.get(
                'days_fri_start_district')
            route_friday_end = request.form.get(
                'days_fri_end_district')

            route_saturday = request.form.getlist(
                'ts_route_district_days_custom_sat')
            route_saturday_start = request.form.get(
                'days_sat_start_district')
            route_saturday_end = request.form.get(
                'days_sat_end_district')

            route_sunday = request.form.getlist(
                'ts_route_district_days_custom_sun')
            route_sunday_start = request.form.get(
                'days_sun_start_district')
            route_sunday_end = request.form.get(
                'days_sun_end_district')

            comment = request.form.get(
                'ts_route_district_comment')
            if not comment:
                return make_response(
                    jsonify(missing_param('comment')), 400)

            new_route = Route(
                user_id=g.user.id,
                car_id=int(car_id),
                route_name=route_name,
                route_type=int(route_type),
                district=int(district),
                route_days=route_days,
                route_monday=int(bool(route_monday)),
                route_monday_start=route_monday_start,
                route_monday_end=route_monday_end,
                route_tuesday=int(bool(route_tuesday)),
                route_tuesday_start=route_tuesday_start,
                route_tuesday_end=route_tuesday_end,
                route_wednesday=int(bool(route_wednesday)),
                route_wednesday_start=route_wednesday_start,
                route_wednesday_end=route_wednesday_end,
                route_thursday=int(bool(route_thursday)),
                route_thursday_start=route_thursday_start,
                route_thursday_end=route_thursday_end,
                route_friday=int(bool(route_friday)),
                route_friday_start=route_friday_start,
                route_friday_end=route_friday_end,
                route_saturday=int(bool(route_saturday)),
                route_saturday_start=route_saturday_start,
                route_saturday_end=route_saturday_end,
                route_sunday=int(bool(route_sunday)),
                route_sunday_start=route_sunday_start,
                route_sunday_end=route_sunday_end,
                comment=comment)

            print(str(new_route))

            db.session.add(new_route)
            db.session.commit()

        else:
            route_time_start = request.form.get('route_time_start')
            if not route_time_start:
                return make_response(
                    jsonify(missing_param('route_time_start')), 400)

            route_time_end = request.form.get('route_time_end')
            if not route_time_end:
                return make_response(
                    jsonify(missing_param('route_time_end')), 400)

            comment = request.form.get('ts_route_district_comment')
            if not comment:
                return make_response(
                    jsonify(missing_param('comment')), 400)

            new_route = Route(
                user_id=g.user.id,
                car_id=int(car_id),
                route_name=route_name,
                route_type=int(route_type),
                district=int(district),
                route_days=route_days,
                route_time_start=route_time_start,
                route_time_end=route_time_end,
                comment=comment)

            print(str(new_route))

            db.session.add(new_route)
            db.session.commit()
    else:
        borders = request.form.get('ts_route_3_var')
        if not borders:
            return make_response(
                jsonify(missing_param('borders')), 400)

        route_time_start = request.form.get('ts_route_3_start')
        if not route_time_start:
            return make_response(
                jsonify(missing_param('route_time_start')), 400)

        route_time_end = request.form.get('ts_route_3_end')
        if not route_time_end:
            return make_response(
                jsonify(missing_param('route_time_end')), 400)

        km = request.form.get('ts_route_3_length')
        if not km:
            return make_response(
                jsonify(missing_param('km')), 400)

        comment = request.form.get('ts_route_3_comment')
        if not comment:
            return make_response(
                jsonify(missing_param('comment')), 400)

        new_route = Route(
            user_id=g.user.id,
            car_id=int(car_id),
            route_name=route_name,
            route_type=int(route_type),
            borders=int(borders),
            route_time_start=route_time_start,
            route_time_end=route_time_end,
            comment=comment,
            km=int(km))

        print(str(new_route))

        db.session.add(new_route)
        db.session.commit()

    return make_response(jsonify(construct_response(0, 'OK')), 200)
