from app import create_app, db

app = create_app()
app.app_context().push()

# Query occupancies table directly
print("=" * 70)
print("OCCUPANCIES TABLE")
print("=" * 70)
result = db.session.execute(db.text("SELECT id, space_id, vehicle_id, user_id, entry_time, status FROM occupancies LIMIT 5"))
rows = result.fetchall()
print(f"Total columns: id, space_id, vehicle_id, user_id, entry_time, status")
print(f"Found {len(rows)} occupancies:\n")
for row in rows:
    print(f"  ID: {row[0]}, Space: {row[1]}, Vehicle: {row[2]}, User ID: {row[3]}, Entry: {row[4]}, Status: {row[5]}")

# Query billing table directly
print("\n" + "=" * 70)
print("BILLING TABLE")
print("=" * 70)
result = db.session.execute(db.text("SELECT id, occupancy_id, user_id, amount, payment_status FROM billing LIMIT 5"))
rows = result.fetchall()
print(f"Total columns: id, occupancy_id, user_id, amount, payment_status")
print(f"Found {len(rows)} billing records:\n")
for row in rows:
    print(f"  ID: {row[0]}, Occupancy: {row[1]}, User ID: {row[2]}, Amount: {row[3]}, Status: {row[4]}")

# Check schema
print("\n" + "=" * 70)
print("DATABASE SCHEMA")
print("=" * 70)
from sqlalchemy import inspect
inspector = inspect(db.engine)

print("\nOccupancies columns:")
for col in inspector.get_columns('occupancies'):
    print(f"  - {col['name']}: {col['type']}")

print("\nBilling columns:")
for col in inspector.get_columns('billing'):
    print(f"  - {col['name']}: {col['type']}")

print("\n✅ user_id columns verified in both tables!")
