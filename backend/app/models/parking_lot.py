from app.extensions import db
from app.models.base import BaseModel
from app.models.parking_space import ParkingSpace, SpaceType, SpaceState

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
    
    def get_available_spaces_count(self, space_type=None):
        """Get count of available spaces, optionally filtered by type"""
        # FIXED: Create a new query instead of using self.parking_spaces.filter()
        query = ParkingSpace.query.filter(
            ParkingSpace.lot_id == self.id,
            ParkingSpace.state == SpaceState.UNOCCUPIED
        )
        
        if space_type:
            query = query.filter(ParkingSpace.space_type == space_type)
        
        return query.count()

    def to_dict_with_availability(self):
        """Enhanced to_dict with availability counts"""
        data = self.to_dict()
        data['available_2w_spaces'] = self.get_available_spaces_count(SpaceType.TWO_WHEELER)
        data['available_4w_spaces'] = self.get_available_spaces_count(SpaceType.FOUR_WHEELER)
        data['available_ev_spaces'] = self.get_available_spaces_count(SpaceType.EV)
        data['total_available_spaces'] = self.get_available_spaces_count()
        return data

    def __repr__(self):
        return f'<ParkingLot {self.name}>'