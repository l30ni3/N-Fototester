from app import db
from datetime import datetime


class Measurement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.String(64))
    image = db.Column(db.String(64))
    hue_circular_mean = db.Column(db.Integer)
    hue_circular_std = db.Column(db.Integer)
    hue_median = db.Column(db.Integer)

    def to_dict(self):
        data = {
            'id': self.id,
            'timestamp': self.timestamp,
            'image': self.image,
            'hue_circular_mean': self.hue_circular_mean,
            'hue_circular_std': self.hue_circular_std,
            'hue_median': self.hue_median,
        }
        return data

    def from_dict(self, data):
        for field in ['timestamp', 'image', 'hue_circular_mean', 'hue_circular_std', 'hue_median']:
            if field in data:
                setattr(self, field, data[field])


class File(db.Model):
    id = db.Column(db.Integer,  primary_key=True)
    uri = db.Column(db.String(128))
    name = db.Column(db.String(128))
    type = db.Column(db.String(128))
    data = db.Column(db.LargeBinary)
    pic_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        data = {
            'id': self.id,
            'uri': self.uri,
            'name': self.name,
            'type': self.type,
            # 'data': self.data,
            'date': self.pic_date,
        }
        return data

    def from_dict(self, data):
        for field in ['name', 'pic_date']:
            if field in data:
                setattr(self, field, data[field])

    def __repr__(self):
        return f'Name: {self.name} created on: {self.pic_date}'
