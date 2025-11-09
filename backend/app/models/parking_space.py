from app.extensions import db
from app.models.base import BaseModel
import enum

class SpaceType(enum.Enum):
    TWO_WHEELER = '2W'
    FOUR_WHEELER = '4W'
    EV = 'EV'
    VIP = 'VIP'
    DISABLED = 'DISABLED'

class SpaceState(enum.Enum):
    OCCUPIED = 'occupied'
    UNOCCUPIED = 'unoccupied'
    RESERVED = 'reserved'
    MAINTENANCE = 'maintenance'

class ParkingSpace(BaseModel):
    __tablename__ = 'parking_spaces'
    
    id = db.Column(db.Integer, primary_key=True)
    lot_id = db.Column(db.Integer, db.ForeignKey('parking_lots.id'), nullable=False)
    space_type = db.Column(db.Enum(SpaceType), nullable=False)
    state = db.Column(db.Enum(SpaceState), default=SpaceState.UNOCCUPIED)
    extra_charge = db.Column(db.Numeric(10, 2), default=0.0)
    
    # Relationships
    occupancies = db.relationship('Occupancy', backref='parking_space', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'lot_id': self.lot_id,
            'space_type': self.space_type.value,
            'state': self.state.value,
            'extra_charge': float(self.extra_charge),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<ParkingSpace {self.id} - {self.space_type.value}>'