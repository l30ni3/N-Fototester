import os
from flask import Flask, request, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_moment import Moment
from flask_babel import Babel, lazy_gettext as _l
from config import Config

db = SQLAlchemy()
migrate = Migrate()
moment = Moment()
babel = Babel()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    moment.init_app(app)
    babel.init_app(app)

    from app.views import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
