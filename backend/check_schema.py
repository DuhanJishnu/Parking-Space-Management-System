from app import db, create_app
from sqlalchemy import inspect

app = create_app()
app.app_context().push()

inspector = inspect(db.engine)
occ_cols = [c['name'] for c in inspector.get_columns('occupancies')]
bill_cols = [c['name'] for c in inspector.get_columns('billing')]

print('occupancies columns:', occ_cols)
print('billing columns:', bill_cols)
print('\nuser_id in occupancies:', 'user_id' in occ_cols)
print('user_id in billing:', 'user_id' in bill_cols)
