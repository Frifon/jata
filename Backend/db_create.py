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
db.session.commit()