from os import system
import argparse
from sys import platform as _platform

project_dir = 'Backend'
database_name = 'app.db'
database_create_script = 'db_create.py'
start_script = 'run.py'
error_log = 'error'
start_admin = 'db_admin.py'
error_log_admin = 'db_error'

def run(command):
    print (command)
    system(command)

def is_lin():
    return _platform != "win32"

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--database', action='store_true')
    args = parser.parse_args()

    if args.database:
        if is_lin():
            run("rm {0}/{1}".format(project_dir, database_name))
            run("python3 {0}/{1}".format(project_dir, database_create_script))
        else:
            run("del {0}\\{1}".format(project_dir, database_name))
            run("py -3 {0}\\{1}".format(project_dir, database_create_script))          

    if is_lin():
        run("nohup python3 {0}/{1} 1>{0}/{2} 2>&1 &".format(project_dir, start_script, error_log))
        run("nohup python2.7 {0}/{1} 1>{0}/{2} 2>&1 &".format(project_dir, start_admin, error_log_admin))
    else:
        run("start py -3 {0}\\{1} 1>{0}\\{2} 2>&1 &".format(project_dir, start_script, error_log))
        run("start py -2 {0}\\{1} 1>{0}\\{2} 2>&1 &".format(project_dir, start_admin, error_log_admin))
