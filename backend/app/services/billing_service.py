from app.extensions import db
from app.models.billing import Billing, PaymentStatus
from app.models.occupancy import Occupancy
from app.models.parking_space import ParkingSpace
from app.models.parking_lot import ParkingLot
from datetime import datetime, timezone

class BillingService:
    
    @staticmethod
    def calculate_charges(occupancy):
        """Calculate parking charges based on duration and rates"""
        if not occupancy.exit_time:
            exit_time = datetime.now(timezone.utc)
        else:
            exit_time = occupancy.exit_time
        
        # Ensure entry_time is timezone-aware
        entry_time = occupancy.entry_time
        if entry_time.tzinfo is None:
            entry_time = entry_time.replace(tzinfo=timezone.utc)
        if exit_time.tzinfo is None:
            exit_time = exit_time.replace(tzinfo=timezone.utc)
        
        duration_hours = (exit_time - entry_time).total_seconds() / 3600
        
        # Get space and lot information for rates
        space = ParkingSpace.query.get(occupancy.space_id)
        lot = space.parking_lot if space else None
        
        if not lot:
            return 0.0
        
        # Calculate base charge
        base_rate = float(lot.base_rate)
        extra_charge = float(space.extra_charge) if space else 0.0
        
        # Simple calculation: hourly rate * duration
        total_charge = (base_rate + extra_charge) * max(1, round(duration_hours))
        
        return total_charge
    
    @staticmethod
    def create_billing_record(occupancy_id, amount, user_id=None):
        """Create a billing record for an occupancy"""
        occupancy = Occupancy.query.get(occupancy_id)
        
        # If user_id not provided, try to get it from occupancy
        if not user_id and occupancy:
            user_id = occupancy.user_id
        
        billing = Billing(
            occupancy_id=occupancy_id,
            user_id=user_id,
            amount=amount,
            payment_status=PaymentStatus.PENDING
        )
        
        db.session.add(billing)
        return billing
    
    @staticmethod
    def process_payment(billing_id, payment_time=None):
        """Process payment for a billing record"""
        billing = Billing.query.get(billing_id)
        if not billing:
            return None, "Billing record not found"
        
        billing.payment_status = PaymentStatus.PAID
        billing.payment_time = payment_time or datetime.now(timezone.utc)
        
        db.session.commit()
        
        return billing, "Payment processed successfully"