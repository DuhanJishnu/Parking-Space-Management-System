from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.parking_space import ParkingSpace, SpaceType, SpaceState
from app.models.parking_lot import ParkingLot

parking_spaces_bp = Blueprint('parking_spaces', __name__)

@parking_spaces_bp.route('/', methods=['GET'])
def get_parking_spaces():
    """Get all parking spaces with optional filtering"""
    try:
        lot_id = request.args.get('lot_id', type=int)
        space_type = request.args.get('space_type')
        state = request.args.get('state')
        
        query = ParkingSpace.query
        
        if lot_id:
            query = query.filter(ParkingSpace.lot_id == lot_id)
        if space_type:
            query = query.filter(ParkingSpace.space_type == SpaceType(space_type))
        if state:
            query = query.filter(ParkingSpace.state == SpaceState(state))
        
        spaces = query.all()
        
        return jsonify({
            'success': True,
            'data': [space.to_dict() for space in spaces],
            'count': len(spaces)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@parking_spaces_bp.route('/<int:space_id>', methods=['GET'])
def get_parking_space(space_id):
    """Get a specific parking space by ID"""
    try:
        space = ParkingSpace.query.get_or_404(space_id)
        return jsonify({
            'success': True,
            'data': space.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404

@parking_spaces_bp.route('/', methods=['POST'])
def create_parking_space():
    """Create a new parking space"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['lot_id', 'space_type']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Check if parking lot exists
        lot = ParkingLot.query.get(data['lot_id'])
        if not lot:
            return jsonify({
                'success': False,
                'error': 'Parking lot not found'
            }), 404
        
        space = ParkingSpace(
            lot_id=data['lot_id'],
            space_type=SpaceType(data['space_type']),
            state=SpaceState(data.get('state', 'unoccupied')),
            extra_charge=data.get('extra_charge', 0.0)
        )
        
        db.session.add(space)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': space.to_dict(),
            'message': 'Parking space created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@parking_spaces_bp.route('/<int:space_id>', methods=['PUT'])
def update_parking_space(space_id):
    """Update a parking space"""
    try:
        space = ParkingSpace.query.get_or_404(space_id)
        data = request.get_json()
        
        if 'lot_id' in data:
            # Check if new lot exists
            lot = ParkingLot.query.get(data['lot_id'])
            if not lot:
                return jsonify({
                    'success': False,
                    'error': 'Parking lot not found'
                }), 404
            space.lot_id = data['lot_id']
        
        if 'space_type' in data:
            space.space_type = SpaceType(data['space_type'])
        if 'state' in data:
            space.state = SpaceState(data['state'])
        if 'extra_charge' in data:
            space.extra_charge = data['extra_charge']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': space.to_dict(),
            'message': 'Parking space updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@parking_spaces_bp.route('/<int:space_id>', methods=['DELETE'])
def delete_parking_space(space_id):
    """Delete a parking space"""
    try:
        space = ParkingSpace.query.get_or_404(space_id)
        
        # Check if space is occupied
        if space.state == SpaceState.OCCUPIED:
            return jsonify({
                'success': False,
                'error': 'Cannot delete an occupied parking space'
            }), 400
        
        db.session.delete(space)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Parking space deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@parking_spaces_bp.route('/available', methods=['GET'])
def get_available_spaces():
    """Get available parking spaces with filters"""
    try:
        from app.services.parking_service import ParkingService
        
        lot_id = request.args.get('lot_id', type=int)
        space_type = request.args.get('space_type')
        
        if space_type:
            space_type = SpaceType(space_type)
        
        available_spaces = ParkingService.get_available_spaces(
            lot_id=lot_id, 
            space_type=space_type
        )
        
        return jsonify({
            'success': True,
            'data': [space.to_dict() for space in available_spaces],
            'count': len(available_spaces)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500