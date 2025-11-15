from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.parking_lot import ParkingLot
from app.services.parking_service import ParkingService


parking_lots_bp = Blueprint('parking_lots', __name__)

@parking_lots_bp.route('/', methods=['GET'])
def get_parking_lots():
    """Get all parking lots with availability info"""
    try:
        lots = ParkingLot.query.all()
        
        return jsonify({
            'success': True,
            'data': [lot.to_dict_with_availability() for lot in lots],
            'count': len(lots)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@parking_lots_bp.route('/<int:lot_id>', methods=['GET'])
def get_parking_lot(lot_id):
    """Get a specific parking lot by ID"""
    try:
        lot = ParkingLot.query.get_or_404(lot_id)
        return jsonify({
            'success': True,
            'data': lot.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404

@parking_lots_bp.route('/', methods=['POST'])
def create_parking_lot():
    """Create a new parking lot"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'location', 'capacity', 'base_rate']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Check if lot with same name already exists
        existing_lot = ParkingLot.query.filter_by(name=data['name']).first()
        if existing_lot:
            return jsonify({
                'success': False,
                'error': 'Parking lot with this name already exists'
            }), 400
        
        lot = ParkingLot(
            name=data['name'],
            location=data['location'],
            capacity=data['capacity'],
            base_rate=data['base_rate'],
            geo_location=data.get('geo_location')
        )
        
        db.session.add(lot)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': lot.to_dict(),
            'message': 'Parking lot created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@parking_lots_bp.route('/<int:lot_id>', methods=['PUT'])
def update_parking_lot(lot_id):
    """Update a parking lot"""
    try:
        lot = ParkingLot.query.get_or_404(lot_id)
        data = request.get_json()
        
        if 'name' in data:
            # Check if name is being changed and if it conflicts with existing
            if data['name'] != lot.name:
                existing_lot = ParkingLot.query.filter_by(name=data['name']).first()
                if existing_lot:
                    return jsonify({
                        'success': False,
                        'error': 'Parking lot with this name already exists'
                    }), 400
            lot.name = data['name']
        
        if 'location' in data:
            lot.location = data['location']
        if 'capacity' in data:
            lot.capacity = data['capacity']
        if 'base_rate' in data:
            lot.base_rate = data['base_rate']
        if 'geo_location' in data:
            lot.geo_location = data['geo_location']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': lot.to_dict(),
            'message': 'Parking lot updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@parking_lots_bp.route('/<int:lot_id>', methods=['DELETE'])
def delete_parking_lot(lot_id):
    """Delete a parking lot"""
    try:
        lot = ParkingLot.query.get_or_404(lot_id)
        
        # Check if lot has parking spaces
        if lot.parking_spaces:
            return jsonify({
                'success': False,
                'error': 'Cannot delete parking lot with existing parking spaces'
            }), 400
        
        db.session.delete(lot)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Parking lot deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@parking_lots_bp.route('/<int:lot_id>/spaces', methods=['GET'])
def get_lot_spaces(lot_id):
    """Get all parking spaces for a specific lot"""
    try:
        lot = ParkingLot.query.get_or_404(lot_id)
        spaces = [space.to_dict() for space in lot.parking_spaces]
        
        return jsonify({
            'success': True,
            'data': spaces,
            'count': len(spaces)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500