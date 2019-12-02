from flask import Flask
from flask_mongoengine import MongoEngine

from web.routes import projects


app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = {
    'db': 'pik',
}

app.register_blueprint(projects.bp)
db = MongoEngine()

db.init_app(app)
