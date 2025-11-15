#!/usr/bin/env python3
"""
Simple setup script for Parking Management System with Neon PostgreSQL
Replaces: setup_neon.py, migrate_neon.py, reset_migrations.py, fixed_migrate.py
"""

import os
import subprocess
import sys
from app import create_app
from app.extensions import db

def run_command(command, description):
    """Run a shell command and print description"""
    print(f"⏳ {description}...")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"❌ Error: {result.stderr}")
        return False
    print(f"✅ {description} completed")
    return True

def setup_database():
    """Setup database using standard Flask-Migrate commands"""
    app = create_app('development')
    
    with app.app_context():
        print("🚀 Starting database setup...")
        
        # Check if migrations directory exists, if not initialize
        if not os.path.exists('migrations'):
            if not run_command('flask db init', 'Initializing migrations'):
                return False
        
        # Generate migration
        if not run_command('flask db migrate -m "Initial tables"', 'Generating migration'):
            return False
        
        # Apply migration
        if not run_command('flask db upgrade', 'Applying migration'):
            return False
        
        print("🎉 Database setup completed successfully!")
        return True

def create_sample_data():
    """Create sample data"""
    from create_db import create_sample_data as create_data
    create_data()

if __name__ == '__main__':
    if setup_database():
        print("\nWould you like to create sample data? (y/n)")
        choice = input().strip().lower()
        if choice in ['y', 'yes']:
            create_sample_data()
        print("\n✨ Setup complete! Run 'python run.py' to start the server.")
    else:
        print("\n❌ Setup failed. Please check the errors above.")
        sys.exit(1)