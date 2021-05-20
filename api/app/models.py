from app import db
from datetime import datetime


class Result(db.Model):
    id = db.Column(db.Integer,  primary_key=True)
    # date = db.Column(
    #     db.DateTime, default=datetime.utcnow)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    name = db.Column(db.String(128))
    type = db.Column(db.String(128))
    data = db.Column(db.LargeBinary)
    color_histogram = db.Column(db.LargeBinary)
    hue_circular_mean = db.Column(db.Integer)
    hue_circular_std = db.Column(db.Integer)
    hue_median = db.Column(db.Integer)

    def to_dict(self):
        data = {
            'id': self.id,
            'date': self.date,
            'name': self.name,
            'type': self.type,
            # 'data': self.data,
            'hue_circular_mean': self.hue_circular_mean,
            'hue_circular_std': self.hue_circular_std,
            'hue_median': self.hue_median
        }
        return data

    def from_dict(self, data):
        for field in ['id', 'date', 'name', 'type', 'hue_circular_mean', 'hue_circular_std', 'hue_median']:
            if field in data:
                setattr(self, field, data[field])

    def __repr__(self):
        return f'File: {self.name} created on: {self.date}'
