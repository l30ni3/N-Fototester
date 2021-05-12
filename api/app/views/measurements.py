from flask import jsonify, request, url_for, abort
from app import db
from app.models import Measurement
from app.views import bp


@bp.route('/measurements/<int:id>', methods=['GET'])
def get_measurement(id):
    return jsonify(User.query.get_or_404(id).to_dict())


@bp.route('/measurements', methods=['GET'])
def get_measurements():
    measurements_list = Measurement.query.all()
    measurements = []

    for measurement in measurements_list:
        measurements.append({'id': measurement.id, 'timestamp': measurement.timestamp, 'image': measurement.image, 'hue_circular_mean': measurement.hue_circular_mean,
                            'hue_circular_std': measurement.hue_circular_std, 'hue_median': measurement.hue_median, })
    return jsonify(measurements)


@bp.route('/measurements', methods=['POST'])
def create_measurement():
    data = request.get_json() or {}
    msr = Measurement()
    msr.from_dict(data)
    db.session.add(msr)
    db.session.commit()
    response = jsonify(msr.to_dict())
    response.status_code = 201
    return 'Done', 201
