from app import create_app, db
from app.models import Measurement
import time

app = create_app()


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Measurement': Measurement}
