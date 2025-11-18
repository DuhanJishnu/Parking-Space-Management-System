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
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Owner/Customer
    entry_time = db.Column(db.DateTime, nullable=False)
    exit_time = db.Column(db.DateTime)
    status = db.Column(db.Enum(OccupancyStatus), default=OccupancyStatus.ACTIVE)
    
    # Relationships
    billing = db.relationship('Billing', backref='occupancy', uselist=False, lazy=True)
    user = db.relationship('User', backref='occupancies', lazy=True)
    
    def to_dict(self):
        vehicle_info = None
        owner_info = None
        
        if self.vehicle_id and self.vehicle:
            vehicle_info = {
                'id': self.vehicle.id,
                'vehicle_id': self.vehicle.vehicle_id,
                'vehicle_type': self.vehicle.vehicle_type.value
            }
            
            if self.vehicle.owner:
                owner_info = {
                    'id': self.vehicle.owner.id,
                    'name': self.vehicle.owner.name,
                    'contact_no': self.vehicle.owner.contact_no,
                    'role': self.vehicle.owner.role.value
                }
        
        return {
            'id': self.id,
            'space_id': self.space_id,
            'vehicle_id': self.vehicle_id,
            'user_id': self.user_id,
            'vehicle': vehicle_info,
            'owner': owner_info,
            'entry_time': self.entry_time.isoformat() if self.entry_time else None,
            'exit_time': self.exit_time.isoformat() if self.exit_time else None,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Occupancy {self.id} - {self.status.value}>'