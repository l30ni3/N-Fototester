from flask import Blueprint

bp = Blueprint('api', __name__)
from app.views import measurements, files