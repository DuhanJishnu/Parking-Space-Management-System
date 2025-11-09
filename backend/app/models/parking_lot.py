from app.extensions import db
from app.models.base import BaseModel

class ParkingLot(BaseModel):
    __tablename__ = 'parking_lots'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    base_rate = db.Column(db.Numeric(10, 2), nullable=False)  # hourly rate
    geo_location = db.Column(db.String(100))  # Could be extended to PostGIS
    
    # Relationships
    parking_spaces = db.relationship('ParkingSpace', backref='parking_lot', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'capacity': self.capacity,
            'base_rate': float(self.base_rate),
            'geo_location': self.geo_location,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<ParkingLot {self.name}>'