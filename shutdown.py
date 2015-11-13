from os import system
from sys import platform as _platform

def run(command):
    print (command)
    system(command)

def is_lin():
    return _platform != "win32"

def shutdown():
    if not is_lin():
        return
    run("killall python2 python2.7 python python3 python3.2 python3.4 python3.5 Python")

if __name__ == "__main__":
    shutdown()