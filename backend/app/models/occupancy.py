from app.extensions import db
from app.models.base import BaseModel
import enum

class OccupancyStatus(enum.Enum):
    ACTIVE = 'active'
    COMPLETED = 'completed'

class Occupancy(BaseModel):
    __tablename__ = 'occupancies'
    
    id = db.Column(db.Integer, primary_key=True)
    space_id = db.Column(db.Integer, db.ForeignKey('parking_spaces.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=True)  # Nullable for reservations
    entry_time = db.Column(db.DateTime, nullable=False)
    exit_time = db.Column(db.DateTime)
    status = db.Column(db.Enum(OccupancyStatus), default=OccupancyStatus.ACTIVE)
    
    # Relationships
    billing = db.relationship('Billing', backref='occupancy', uselist=False, lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'space_id': self.space_id,
            'vehicle_id': self.vehicle_id,
            'entry_time': self.entry_time.isoformat() if self.entry_time else None,
            'exit_time': self.exit_time.isoformat() if self.exit_time else None,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Occupancy {self.id} - {self.status.value}>'