from app import db, create_app

app = create_app()
app.app_context().push()

# Query the alembic_version table directly
result = db.session.execute(db.text("SELECT version_num FROM alembic_version"))
rows = result.fetchall()
print("Current alembic versions:", rows)

# Update to the correct migration
db.session.execute(db.text("DELETE FROM alembic_version"))
db.session.execute(db.text("INSERT INTO alembic_version (version_num) VALUES ('add_user_id_columns')"))
db.session.commit()

# Verify
result = db.session.execute(db.text("SELECT version_num FROM alembic_version"))
rows = result.fetchall()
print("Updated alembic versions:", rows)
