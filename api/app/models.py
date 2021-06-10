from app import db
from datetime import datetime


class Result(db.Model):
    id = db.Column(db.Integer,  primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    name = db.Column(db.String(128))
    type = db.Column(db.String(128))
    img = db.Column(db.Text)
    hue_median = db.Column(db.Integer)
    crop = db.Column(db.String(128))
    growth = db.Column(db.String(128))
    variant = db.Column(db.String(128))
    replicate = db.Column(db.String(128))

    def to_dict(self):
        data = {
            'id': self.id,
            'date': self.date,
            'name': self.name,
            'type': self.type,
            'hue_median': self.hue_median,
            'crop': self.crop,
            'growth': self.growth,
            'variant': self.variant,
            'replicate': self.replicate
        }
        return data

    def from_dict(self, data):
        for field in ['id', 'date', 'name', 'type', 'hue_median', 'crop', 'growth', 'variant', 'replicate']:
            if field in data:
                setattr(self, field, data[field])

    def __repr__(self):
        return f'File: {self.name} created on: {self.date}'
