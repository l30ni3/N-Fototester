from app import db


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
