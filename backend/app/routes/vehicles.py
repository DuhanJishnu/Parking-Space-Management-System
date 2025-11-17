from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.vehicle import Vehicle, VehicleType
from app.models.user import User

vehicles_bp = Blueprint('vehicles', __name__)

@vehicles_bp.route('/', methods=['GET'])
def get_vehicles():
    """Get all vehicles with optional filtering"""
    try:
        owner_id = request.args.get('owner_id', type=int)
        vehicle_type = request.args.get('vehicle_type')
        
        query = Vehicle.query
        
        if owner_id:
            query = query.filter(Vehicle.owner_id == owner_id)
        if vehicle_type:
            query = query.filter(Vehicle.vehicle_type == VehicleType(vehicle_type))
        
        vehicles = query.all()
        
        return jsonify({
            'success': True,
            'data': [vehicle.to_dict() for vehicle in vehicles],
            'count': len(vehicles)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@vehicles_bp.route('/<string:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    """Get a specific vehicle by ID"""
    try:
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        return jsonify({
            'success': True,
            'data': vehicle.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404

@vehicles_bp.route('/', methods=['POST'])
def create_vehicle():
    """Create a new vehicle"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['vehicle_id', 'vehicle_type']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Check if vehicle already exists - FIXED: query by vehicle_id field, not primary key
        existing_vehicle = Vehicle.query.filter_by(vehicle_id=data['vehicle_id']).first()
        if existing_vehicle:
            return jsonify({
                'success': False,
                'error': 'Vehicle with this registration number already exists'
            }), 400
        
        # Check if owner exists (if provided)
        owner_id = data.get('owner_id') or data.get('user_id')  # Handle both user_id and owner_id
        if owner_id:
            owner = User.query.get(owner_id)
            if not owner:
                return jsonify({
                    'success': False,
                    'error': 'Owner not found'
                }), 404
        
        vehicle = Vehicle(
            vehicle_id=data['vehicle_id'],
            owner_id=owner_id,
            vehicle_type=VehicleType(data['vehicle_type'])
        )
        
        db.session.add(vehicle)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': vehicle.to_dict(),
            'message': 'Vehicle registered successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@vehicles_bp.route('/<string:vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    """Update a vehicle"""
    try:
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        data = request.get_json()
        
        if 'owner_id' in data:
            # Check if new owner exists
            if data['owner_id']:
                owner = User.query.get(data['owner_id'])
                if not owner:
                    return jsonify({
                        'success': False,
                        'error': 'Owner not found'
                    }), 404
            vehicle.owner_id = data['owner_id']
        
        if 'vehicle_type' in data:
            vehicle.vehicle_type = VehicleType(data['vehicle_type'])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': vehicle.to_dict(),
            'message': 'Vehicle updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@vehicles_bp.route('/<string:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    """Delete a vehicle"""
    try:
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        
        # Check if vehicle has active occupancies
        from app.models.occupancy import Occupancy, OccupancyStatus
        active_occupancy = Occupancy.query.filter(
            Occupancy.vehicle_id == vehicle_id,
            Occupancy.status == OccupancyStatus.ACTIVE
        ).first()
        
        if active_occupancy:
            return jsonify({
                'success': False,
                'error': 'Cannot delete vehicle with active parking session'
            }), 400
        
        db.session.delete(vehicle)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Vehicle deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500