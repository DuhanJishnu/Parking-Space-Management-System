import os
import sys
from dotenv import load_dotenv
from app import create_app

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

# Load environment variables from .env file
load_dotenv()

# Create the application instance using the factory
app = create_app(os.getenv('FLASK_CONFIG') or 'default')

if __name__ == '__main__':
    print("Starting Server...")
    
    app.run(host='0.0.0.0', port=5000, debug=True)