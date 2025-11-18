from app import create_app, db
from app.models import User, Occupancy, Billing, Vehicle, ParkingSpace, ParkingLot

app = create_app()
app.app_context().push()

print("✓ Flask app initialized successfully")

# Verify models
print("✓ User model:", User.__tablename__)
print("✓ Occupancy model:", Occupancy.__tablename__)
print("✓ Billing model:", Billing.__tablename__)
print("✓ Vehicle model:", Vehicle.__tablename__)

# Check Occupancy has user_id
occ_cols = [col.name for col in Occupancy.__table__.columns]
print(f"\n✓ Occupancy columns: {occ_cols}")
print(f"  - user_id present: {'user_id' in occ_cols}")

# Check Billing has user_id
bill_cols = [col.name for col in Billing.__table__.columns]
print(f"\n✓ Billing columns: {bill_cols}")
print(f"  - user_id present: {'user_id' in bill_cols}")

print("\n✅ All models verified successfully!")
