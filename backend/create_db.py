from app import create_app
from app.extensions import db
from app.models.vehicle import Vehicle, VehicleType
from app.models.user import User

def add_vehicle_for_user15():
    """Create vehicles for user with ID = 15."""

    app = create_app('development')

    with app.app_context():
        try:
            print("Adding vehicles for user ID 15...")

            # Fetch user
            user = User.query.get(15)

            if not user:
                print("❌ User with ID 15 does not exist.")
                return

            vehicles_to_add = [
                {"vehicle_id": "JH01AB1111", "type": VehicleType.FOUR_WHEELER},
                {"vehicle_id": "JH01XY2222", "type": VehicleType.TWO_WHEELER}
            ]

            for v in vehicles_to_add:
                existing = Vehicle.query.filter_by(vehicle_id=v["vehicle_id"]).first()

                if not existing:
                    new_vehicle = Vehicle(
                        vehicle_id=v["vehicle_id"],
                        owner_id=user.id,
                        vehicle_type=v["type"]
                    )
                    db.session.add(new_vehicle)
                    print(f"✔ Added vehicle: {v['vehicle_id']} for user {user.id}")
                else:
                    print(f"⏩ Vehicle already exists: {v['vehicle_id']}")

            db.session.commit()
            print("\nVehicles added successfully!")

        except Exception as e:
            db.session.rollback()
            print(f"Error: {e}")
            raise

if __name__ == "__main__":
    add_vehicle_for_user15()
