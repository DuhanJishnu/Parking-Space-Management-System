from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User, UserRole
from sqlalchemy.exc import IntegrityError

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['POST'])
def signin_or_create_user():
    """
    Single endpoint to find user by name and contact number.
    If exists, return user; if not, create new user and return it.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'contact_no']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({
                    'success': False,
                    'error': f'Missing or empty required field: {field}'
                }), 400
        
        name = data['name'].strip()
        contact_no = data['contact_no'].strip()
        
        # Check if user already exists with the same name and contact_no
        existing_user = User.query.filter_by(
            name=name, 
            contact_no=contact_no
        ).first()
        
        if existing_user:
            # User exists, return the existing user
            return jsonify({
                'success': True,
                'data': existing_user.to_dict(),
                'message': 'User found and returned',
                'is_new_user': False
            })
        else:
            # Create new user
            user = User(
                name=name,
                contact_no=contact_no,
                role=UserRole(data.get('role', 'customer'))
            )
            
            db.session.add(user)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'data': user.to_dict(),
                'message': 'New user created successfully',
                'is_new_user': True
            }), 201
            
    except IntegrityError:
        # Handle case where user might have been created by another request simultaneously
        db.session.rollback()
        existing_user = User.query.filter_by(
            name=name, 
            contact_no=contact_no
        ).first()
        
        if existing_user:
            return jsonify({
                'success': True,
                'data': existing_user.to_dict(),
                'message': 'User found and returned',
                'is_new_user': False
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to create user due to database constraint'
            }), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Optional: Keep other endpoints for admin purposes
@users_bp.route('/get_users', methods=['GET'])
def get_users():
    """Get all users with optional role filter (for admin)"""
    try:
        role = request.args.get('role')
        
        query = User.query
        
        if role:
            query = query.filter(User.role == UserRole(role))
        
        users = query.all()
        
        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in users],
            'count': len(users)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user by ID"""
    try:
        user = User.query.get_or_404(user_id)
        return jsonify({
            'success': True,
            'data': user.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404

@users_bp.route('/<int:user_id>/vehicles', methods=['GET'])
def get_user_vehicles(user_id):
    """Get all vehicles for a specific user with optional occupancy filter"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Check if we should filter by occupancy status
        occupancy_filter = request.args.get('occupancy', None)  # 'active', 'none', or None for all
        
        vehicles_data = []
        from app.models.occupancy import Occupancy, OccupancyStatus
        for vehicle in user.vehicles:
            active_occupancy = Occupancy.query.filter_by(
                vehicle_id=vehicle.id,
                status=OccupancyStatus.ACTIVE
            ).first()
            
            # Apply filter if specified
            if occupancy_filter == 'active' and not active_occupancy:
                continue  # Skip vehicles without active occupancy
            elif occupancy_filter == 'none' and active_occupancy:
                continue  # Skip vehicles with active occupancy
            
            vehicle_dict = vehicle.to_dict()
            vehicle_dict['has_active_occupancy'] = active_occupancy is not None
            
            vehicles_data.append(vehicle_dict)
        
        return jsonify({
            'success': True,
            'data': vehicles_data,
            'count': len(vehicles_data)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500