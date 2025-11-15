from app.extensions import db
from app.models.occupancy import Occupancy, OccupancyStatus
from app.models.parking_space import ParkingSpace, SpaceState
from datetime import datetime, timedelta

class OccupancyService:
    
    @staticmethod
    def get_active_occupancies(space_id=None, vehicle_id=None):
        """Get all active occupancies with optional filters"""
        query = Occupancy.query.filter(Occupancy.status == OccupancyStatus.ACTIVE)
        
        if space_id:
            query = query.filter(Occupancy.space_id == space_id)
        
        if vehicle_id:
            query = query.filter(Occupancy.vehicle_id == vehicle_id)
        
        return query.all()
    
    @staticmethod
    def reserve_space(space_id, reservation_duration_minutes=30):
        """Reserve a parking space for a limited time"""
        space = ParkingSpace.query.get(space_id)
        if not space or space.state != SpaceState.UNOCCUPIED:
            return None, "Space is not available for reservation"
        
        space.state = SpaceState.RESERVED
        # In a real system, you'd store reservation expiry time
        
        db.session.commit()
        return space, f"Space reserved for {reservation_duration_minutes} minutes"
    
    @staticmethod
    def get_occupancy_history(vehicle_id=None, start_date=None, end_date=None):
        """Get occupancy history with filters"""
        query = Occupancy.query.filter(Occupancy.status == OccupancyStatus.COMPLETED)
        
        if vehicle_id:
            query = query.filter(Occupancy.vehicle_id == vehicle_id)
        
        if start_date:
            query = query.filter(Occupancy.entry_time >= start_date)
        
        if end_date:
            query = query.filter(Occupancy.entry_time <= end_date)
        
        return query.order_by(Occupancy.entry_time.desc()).all()