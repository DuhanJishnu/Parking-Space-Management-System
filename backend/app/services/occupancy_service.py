from app.extensions import db
from app.models.occupancy import Occupancy, OccupancyStatus
from app.models.parking_space import ParkingSpace, SpaceState
from datetime import datetime, timedelta, timezone

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
    def reserve_space(space_id, user_id=None):
        """Reserve a parking space by creating an occupancy record and marking space as reserved"""
        space = ParkingSpace.query.get(space_id)
        if not space or space.state == SpaceState.OCCUPIED:
            return None, "Space is not available for reservation"
        
        try:
            # Create an occupancy record for the reservation
            occupancy = Occupancy(
                space_id=space_id,
                vehicle_id=None,  # Will be updated when vehicle checks in
                user_id=user_id,  # Store the customer/user
                entry_time=datetime.now(timezone.utc),
                status=OccupancyStatus.ACTIVE
            )
            
            # Mark space as reserved
            space.state = SpaceState.RESERVED
            
            db.session.add(occupancy)
            db.session.commit()
            
            return space, f"Space reserved successfully"
        except Exception as e:
            db.session.rollback()
            return None, f"Error reserving space: {str(e)}"
    
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
    
    # In your OccupancyService class
    @classmethod
    def reserve_and_checkin(cls, space_id, vehicle_registration, entry_time=None, user_id=None):
        """Reserve space and check in vehicle in one operation"""
        try:
            # Reserve the space
            space, reserve_message = cls.reserve_space(space_id=space_id, user_id=user_id)
            
            if not space:
                return None, reserve_message
            
            # Check in the vehicle
            from app.services.parking_service import ParkingService
            occupancy, checkin_message = ParkingService.check_in_vehicle(
                space_id=space_id,
                vehicle_registration=vehicle_registration,
                entry_time=entry_time,
                user_id=user_id
            )
            
            if not occupancy:
                # If check-in fails, release the reservation
                cls.release_reservation(space_id)
                return None, checkin_message
            
            return {
                'space': space,
                'occupancy': occupancy
            }, "Space reserved and vehicle checked in successfully"
            
        except Exception as e:
            # Release reservation if any error occurs
            cls.release_reservation(space_id)
            return None, str(e)

    @classmethod
    def release_reservation(cls, space_id):
        """Release a reservation on a space"""
        # Implementation depends on your reservation system
        # This would typically set the space status back to available
        pass
