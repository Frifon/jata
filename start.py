from os import system
import argparse

project_dir = 'Backend'
database_name = 'app.db'
database_create_script = 'db_create.py'
start_script = 'run.py'
error_log = 'error'
start_admin = 'db_admin.py'
error_log_admin = 'db_error'

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--database', action='store_true')
    args = parser.parse_args()
    if args.database:
        command = "rm {0}/{1}".format(project_dir, database_name)
        print (command)
        system(command)
        command = "python3 {0}/{1}".format(project_dir, database_create_script)
        print (command)
        system(command)
    command = "nohup python3 {0}/{1} 1>{0}/{2} 2>&1 &".format(project_dir, start_script, error_log)
    print (command)
    system(command)
    command = "nohup python2.7 {0}/{1} 1>{0}/{2} 2>&1 &".format(project_dir, start_admin, error_log_admin)
    print (command)
    system(command)