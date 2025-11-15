import os
from app import create_app
from app.extensions import db
from app.models.user import User, UserRole
from app.models.parking_lot import ParkingLot
from app.models.parking_space import ParkingSpace, SpaceType, SpaceState
from app.models.vehicle import Vehicle, VehicleType
from werkzeug.security import generate_password_hash

def create_sample_data():
    """Create sample data for Neon PostgreSQL"""
    app = create_app('development')
    
    with app.app_context():
        try:
            # Create tables (if not exists)
            db.create_all()
            
            print("Creating sample data for Neon PostgreSQL...")
            
            # Check if admin already exists
            admin = User.query.filter_by(email='admin@parking.com').first()
            if not admin:
                # Create admin user
                admin = User(
                    name='Admin User',
                    contact_no='+1234567890',
                    email='admin@parking.com',
                    password_hash=generate_password_hash('admin123'),
                    role=UserRole.ADMIN
                )
                db.session.add(admin)
                print("Created admin user")
            
            # Check if staff already exists
            staff = User.query.filter_by(email='staff@parking.com').first()
            if not staff:
                # Create staff user
                staff = User(
                    name='Staff User',
                    contact_no='+1234567891',
                    email='staff@parking.com',
                    password_hash=generate_password_hash('staff123'),
                    role=UserRole.STAFF
                )
                db.session.add(staff)
                print("Created staff user")
            
            # Check if customer already exists
            customer = User.query.filter_by(email='customer@example.com').first()
            if not customer:
                # Create customer user
                customer = User(
                    name='John Doe',
                    contact_no='+1234567892',
                    email='customer@example.com',
                    password_hash=generate_password_hash('customer123'),
                    role=UserRole.CUSTOMER
                )
                db.session.add(customer)
                print("Created customer user")
            
            db.session.commit()
            
            # Create parking lot if not exists
            lot1 = ParkingLot.query.filter_by(name='Downtown Parking').first()
            if not lot1:
                lot1 = ParkingLot(
                    name='Downtown Parking',
                    location='123 Main St, Downtown',
                    capacity=50,
                    base_rate=5.00,
                    geo_location='40.7128,-74.0060'
                )
                db.session.add(lot1)
                db.session.commit()
                print("Created parking lot")
            
            # Create parking spaces if not exist
            existing_spaces = ParkingSpace.query.filter_by(lot_id=lot1.id).count()
            if existing_spaces == 0:
                # Create regular parking spaces
                for i in range(1, 11):
                    space = ParkingSpace(
                        lot_id=lot1.id,
                        space_type=SpaceType.FOUR_WHEELER,
                        state=SpaceState.UNOCCUPIED,
                        extra_charge=0.0
                    )
                    db.session.add(space)
                
                # Create VIP spaces
                for i in range(11, 16):
                    space = ParkingSpace(
                        lot_id=lot1.id,
                        space_type=SpaceType.VIP,
                        state=SpaceState.UNOCCUPIED,
                        extra_charge=10.0
                    )
                    db.session.add(space)
                
                # Create EV spaces
                for i in range(16, 21):
                    space = ParkingSpace(
                        lot_id=lot1.id,
                        space_type=SpaceType.EV,
                        state=SpaceState.UNOCCUPIED,
                        extra_charge=5.0
                    )
                    db.session.add(space)
                
                print("Created parking spaces")
            
            # Create customer vehicle if not exists
            vehicle = Vehicle.query.filter_by(vehicle_id='ABC123').first()
            if not vehicle:
                vehicle = Vehicle(
                    vehicle_id='ABC123',
                    owner_id=customer.id,
                    vehicle_type=VehicleType.FOUR_WHEELER
                )
                db.session.add(vehicle)
                print("Created customer vehicle")
            
            db.session.commit()
            
            print("\nSample data created successfully in Neon PostgreSQL!")
            print(f"Admin login: admin@parking.com / admin123")
            print(f"Staff login: staff@parking.com / staff123")
            print(f"Customer login: customer@example.com / customer123")
            print(f"Test vehicle ID: ABC123")
            
        except Exception as e:
            db.session.rollback()
            print(f"Error creating sample data: {e}")
            raise

if __name__ == '__main__':
    create_sample_data()