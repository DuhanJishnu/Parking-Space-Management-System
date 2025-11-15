from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User, UserRole
from werkzeug.security import generate_password_hash

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
def get_users():
    """Get all users with optional role filter"""
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

@users_bp.route('/', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'contact_no']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        user = User(
            name=data['name'],
            contact_no=data['contact_no'],
            address=data.get('address'),
            role=UserRole(data.get('role', 'customer'))
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'User created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@users_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update a user"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'contact_no' in data:
            user.contact_no = data['contact_no']
        if 'address' in data:
            user.address = data['address']
        if 'role' in data:
            user.role = UserRole(data['role'])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'User updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@users_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Check if user has vehicles
        if user.vehicles:
            return jsonify({
                'success': False,
                'error': 'Cannot delete user with registered vehicles'
            }), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@users_bp.route('/<int:user_id>/vehicles', methods=['GET'])
def get_user_vehicles(user_id):
    """Get all vehicles for a specific user"""
    try:
        user = User.query.get_or_404(user_id)
        vehicles = [vehicle.to_dict() for vehicle in user.vehicles]
        
        return jsonify({
            'success': True,
            'data': vehicles,
            'count': len(vehicles)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500