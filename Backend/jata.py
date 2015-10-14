from flask import Flask
import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return "JATA.RU <br>Time now: " + str(datetime.datetime.now().time())

if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=80,
        debug=True
    )
