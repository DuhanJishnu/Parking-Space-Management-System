from app.extensions import db
from app.models.base import BaseModel
import enum

class VehicleType(enum.Enum):
    TWO_WHEELER = '2W'
    FOUR_WHEELER = '4W'
    EV = 'EV'

class Vehicle(BaseModel):
    __tablename__ = 'vehicles'
    
    # Using registration number as primary key - but we need to ensure it's properly handled
    id = db.Column(db.Integer, primary_key=True)  # Add integer PK for FK relationships
    vehicle_id = db.Column(db.String(20), unique=True, nullable=False)  # Registration number
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Nullable for walk-ins
    vehicle_type = db.Column(db.Enum(VehicleType), nullable=False)
    
    # Relationships
    occupancies = db.relationship('Occupancy', backref='vehicle', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'vehicle_id': self.vehicle_id,
            'owner_id': self.owner_id,
            'vehicle_type': self.vehicle_type.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Vehicle {self.vehicle_id} - {self.vehicle_type.value}>'