from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.occupancy import Occupancy, OccupancyStatus
from app.services.parking_service import ParkingService
from app.services.occupancy_service import OccupancyService
from datetime import datetime

occupancy_bp = Blueprint('occupancy', __name__)

@occupancy_bp.route('/', methods=['GET'])
def get_occupancies():
    """Get all occupancies with optional filtering"""
    try:
        status = request.args.get('status')
        space_id = request.args.get('space_id', type=int)
        vehicle_id = request.args.get('vehicle_id', type=int)
        
        query = Occupancy.query
        
        if status:
            query = query.filter(Occupancy.status == OccupancyStatus(status))
        if space_id:
            query = query.filter(Occupancy.space_id == space_id)
        if vehicle_id:
            query = query.filter(Occupancy.vehicle_id == vehicle_id)
        
        occupancies = query.order_by(Occupancy.entry_time.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [occ.to_dict() for occ in occupancies],
            'count': len(occupancies)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@occupancy_bp.route('/active', methods=['GET'])
def get_active_occupancies():
    """Get all active occupancies"""
    try:
        active_occupancies = OccupancyService.get_active_occupancies()
        
        return jsonify({
            'success': True,
            'data': [occ.to_dict() for occ in active_occupancies],
            'count': len(active_occupancies)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@occupancy_bp.route('/<int:occupancy_id>', methods=['GET'])
def get_occupancy(occupancy_id):
    """Get a specific occupancy by ID"""
    try:
        occupancy = Occupancy.query.get_or_404(occupancy_id)
        return jsonify({
            'success': True,
            'data': occupancy.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404

@occupancy_bp.route('/reserve', methods=['POST'])
def reserve_space():
    """Reserve a parking space temporarily"""
    try:
        data = request.get_json()
        
        required_fields = ['space_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Reserve the space
        space, message = OccupancyService.reserve_space(
            space_id=data['space_id']
        )
        
        if not space:
            return jsonify({
                'success': False,
                'error': message
            }), 400
        
        return jsonify({
            'success': True,
            'data': space.to_dict(),
            'message': message or 'Space reserved successfully'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@occupancy_bp.route('/check-in', methods=['POST'])
def check_in_vehicle():
    """Check in a vehicle to a parking space (combines reservation and check-in)"""
    try:
        data = request.get_json()
        
        required_fields = ['space_id', 'vehicle_registration']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        entry_time = None
        if 'entry_time' in data:
            entry_time = datetime.fromisoformat(data['entry_time'])
        
        # First, reserve the space
        space, reserve_message = OccupancyService.reserve_space(
            space_id=data['space_id'],
            reservation_duration_minutes=0  # Set to 0 to indicate immediate check-in
        )
        
        if not space:
            return jsonify({
                'success': False,
                'error': reserve_message
            }), 400
        
        # Then check in the vehicle
        occupancy, checkin_message = ParkingService.check_in_vehicle(
            space_id=data['space_id'],
            vehicle_registration=data['vehicle_registration'],
            entry_time=entry_time
        )
        
        if not occupancy:
            return jsonify({
                'success': False,
                'error': checkin_message
            }), 400
        
        return jsonify({
            'success': True,
            'data': {
                'space': space.to_dict(),
                'occupancy': occupancy.to_dict()
            },
            'message': f"Space reserved and vehicle checked in successfully: {checkin_message}"
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@occupancy_bp.route('/<int:occupancy_id>/check-out', methods=['POST'])
def check_out_vehicle(occupancy_id):
    """Check out a vehicle from parking"""
    try:
        data = request.get_json()
        
        exit_time = None
        if 'exit_time' in data:
            exit_time = datetime.fromisoformat(data['exit_time'])
        
        result, message = ParkingService.check_out_vehicle(
            occupancy_id=occupancy_id,
            exit_time=exit_time
        )
        
        if not result:
            return jsonify({
                'success': False,
                'error': message
            }), 400
        
        return jsonify({
            'success': True,
            'data': {
                'occupancy': result['occupancy'].to_dict(),
                'billing': result['billing'].to_dict(),
                'amount': result['amount']
            },
            'message': message
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@occupancy_bp.route('/reserve-and-checkin', methods=['POST'])
def reserve_and_checkin():
    """Reserve a parking space and check in vehicle in one operation"""
    try:
        data = request.get_json()
        
        required_fields = ['space_id', 'vehicle_registration']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        entry_time = None
        if 'entry_time' in data:
            entry_time = datetime.fromisoformat(data['entry_time'])
        
        # Use the combined service method
        result, message = OccupancyService.reserve_and_checkin(
            space_id=data['space_id'],
            vehicle_registration=data['vehicle_registration'],
            entry_time=entry_time
        )
        
        if not result:
            return jsonify({
                'success': False,
                'error': message
            }), 400
        
        return jsonify({
            'success': True,
            'data': {
                'space': result['space'].to_dict(),
                'occupancy': result['occupancy'].to_dict()
            },
            'message': message
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@occupancy_bp.route('/history', methods=['GET'])
def get_occupancy_history():
    """Get occupancy history with filters"""
    try:
        vehicle_id = request.args.get('vehicle_id')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Parse dates if provided
        start_date_obj = None
        end_date_obj = None
        
        if start_date:
            start_date_obj = datetime.fromisoformat(start_date)
        if end_date:
            end_date_obj = datetime.fromisoformat(end_date)
        
        history = OccupancyService.get_occupancy_history(
            vehicle_id=vehicle_id,
            start_date=start_date_obj,
            end_date=end_date_obj
        )
        
        return jsonify({
            'success': True,
            'data': [occ.to_dict() for occ in history],
            'count': len(history)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500