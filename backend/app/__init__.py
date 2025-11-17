from flask import Flask
from app.config import config
from app.extensions import db, migrate, jwt
from flask_cors import CORS

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    CORS(app)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Register blueprints
    from app.routes.parking_lots import parking_lots_bp
    from app.routes.parking_spaces import parking_spaces_bp
    from app.routes.users import users_bp
    from app.routes.vehicles import vehicles_bp
    from app.routes.occupancy import occupancy_bp
    from app.routes.billing import billing_bp
    
    app.register_blueprint(parking_lots_bp, url_prefix='/api/parking-lots')
    app.register_blueprint(parking_spaces_bp, url_prefix='/api/parking-spaces')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(vehicles_bp, url_prefix='/api/vehicles')
    app.register_blueprint(occupancy_bp, url_prefix='/api/occupancy')
    app.register_blueprint(billing_bp, url_prefix='/api/billing')
    
    return app