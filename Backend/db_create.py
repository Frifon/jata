#!flask/bin/python
# from migrate.versioning import api
from config import SQLALCHEMY_DATABASE_URI
from app import db, models
import os.path
print (db)
db.create_all()

# add tech support admin user
db.session.add(models.User(
    email='admin',
    password='pass',
    tel_number='88005553535',
    city='DC',
    role=models.Role.admin | models.Role.car,
    verified=True))

# add test user
db.session.add(models.User(
    email='test',
    password='pass',
    tel_number='89035553535',
    city='DC',
    role=models.Role.car,
    verified=False))

# add test company user
db.session.add(models.User(
    email='comp',
    password='pass',
    tel_number='89055553535',
    city='DC',
    role=models.Role.add,
    verified=False))

db.session.commit()
