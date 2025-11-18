from app.extensions import db
from app.models.parking_space import ParkingSpace, SpaceState
from app.models.occupancy import Occupancy, OccupancyStatus
from app.models.vehicle import Vehicle, VehicleType
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone

class ParkingService:
    
    @staticmethod
    def get_available_spaces(lot_id=None, space_type=None):
        """Get available parking spaces with optional filters"""
        query = ParkingSpace.query.filter(ParkingSpace.state == SpaceState.UNOCCUPIED)
        
        if lot_id:
            query = query.filter(ParkingSpace.lot_id == lot_id)
        
        if space_type:
            query = query.filter(ParkingSpace.space_type == space_type)
        
        return query.all()
    
    @staticmethod
    def check_in_vehicle(space_id, vehicle_registration, entry_time=None, user_id=None):
        """Check in a vehicle to a parking space"""
        try:
            # Check if space is available
            space = ParkingSpace.query.get(space_id)
            if not space or space.state == SpaceState.OCCUPIED:
                return None, "Space is not available"
            
            # Check if vehicle exists, if not create a temporary one (for walk-ins)
            vehicle = Vehicle.query.filter_by(vehicle_id=vehicle_registration).first()
            if not vehicle:
                # For walk-ins, create a temporary vehicle record
                vehicle = Vehicle(
                    vehicle_id=vehicle_registration,
                    owner_id= user_id,
                    vehicle_type=VehicleType.FOUR_WHEELER  # Default type, can be improved
                )
                db.session.add(vehicle)
                db.session.flush()  # Get the vehicle ID without committing
            
            # Ensure entry_time is timezone-aware UTC
            if entry_time is None:
                entry_time = datetime.now(timezone.utc)
            elif entry_time.tzinfo is None:
                entry_time = entry_time.replace(tzinfo=timezone.utc)
            else:
                entry_time = entry_time.astimezone(timezone.utc)
            
            # Create occupancy record
            occupancy = Occupancy(
                space_id=space_id,
                vehicle_id=vehicle.id,  # Use the vehicle's integer ID
                user_id=user_id or (vehicle.owner_id if vehicle.owner else None),  # Use provided user_id or vehicle owner
                entry_time=entry_time,
                status=OccupancyStatus.ACTIVE
            )
            
            # Update space state
            space.state = SpaceState.OCCUPIED
            
            db.session.add(occupancy)
            db.session.commit()
            
            return occupancy, "Vehicle checked in successfully"
            
        except SQLAlchemyError as e:
            db.session.rollback()
            return None, f"Database error: {str(e)}"
    
    @staticmethod
    def check_out_vehicle(occupancy_id, exit_time=None):
        """Check out a vehicle and calculate charges"""
        try:
            occupancy = Occupancy.query.get(occupancy_id)
            if not occupancy or occupancy.status != OccupancyStatus.ACTIVE:
                return None, "Invalid or completed occupancy"
            
            # Set exit time - ensure it's timezone-aware UTC
            if exit_time is None:
                exit_time = datetime.now(timezone.utc)
            elif exit_time.tzinfo is None:
                # If naive datetime, assume UTC
                exit_time = exit_time.replace(tzinfo=timezone.utc)
            else:
                # Convert to UTC if it has a different timezone
                exit_time = exit_time.astimezone(timezone.utc)
            
            occupancy.exit_time = exit_time
            occupancy.status = OccupancyStatus.COMPLETED
            
            # Free up the parking space
            space = ParkingSpace.query.get(occupancy.space_id)
            space.state = SpaceState.UNOCCUPIED
            
            # Calculate charges
            from app.services.billing_service import BillingService
            amount = BillingService.calculate_charges(occupancy)
            
            # Create billing record
            billing = BillingService.create_billing_record(occupancy.id, amount)
            
            db.session.commit()
            
            return {
                'occupancy': occupancy,
                'billing': billing,
                'amount': amount
            }, "Vehicle checked out successfully"
            
        except SQLAlchemyError as e:
            db.session.rollback()
            return None, f"Database error: {str(e)}"