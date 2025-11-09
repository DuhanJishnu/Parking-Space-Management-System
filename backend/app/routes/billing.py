from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.billing import Billing, PaymentStatus
from app.services.billing_service import BillingService

billing_bp = Blueprint('billing', __name__)

@billing_bp.route('/', methods=['GET'])
def get_billing_records():
    """Get all billing records with optional filtering"""
    try:
        payment_status = request.args.get('payment_status')
        occupancy_id = request.args.get('occupancy_id', type=int)
        
        query = Billing.query
        
        if payment_status:
            query = query.filter(Billing.payment_status == PaymentStatus(payment_status))
        if occupancy_id:
            query = query.filter(Billing.occupancy_id == occupancy_id)
        
        billing_records = query.order_by(Billing.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [bill.to_dict() for bill in billing_records],
            'count': len(billing_records)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/<int:billing_id>', methods=['GET'])
def get_billing_record(billing_id):
    """Get a specific billing record by ID"""
    try:
        billing = Billing.query.get_or_404(billing_id)
        return jsonify({
            'success': True,
            'data': billing.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404

@billing_bp.route('/<int:billing_id>/pay', methods=['POST'])
def process_payment(billing_id):
    """Process payment for a billing record"""
    try:
        data = request.get_json()
        
        payment_time = None
        if 'payment_time' in data:
            from datetime import datetime
            payment_time = datetime.fromisoformat(data['payment_time'])
        
        billing, message = BillingService.process_payment(
            billing_id=billing_id,
            payment_time=payment_time
        )
        
        if not billing:
            return jsonify({
                'success': False,
                'error': message
            }), 400
        
        return jsonify({
            'success': True,
            'data': billing.to_dict(),
            'message': message
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/<int:billing_id>/status', methods=['PUT'])
def update_payment_status(billing_id):
    """Update payment status of a billing record"""
    try:
        billing = Billing.query.get_or_404(billing_id)
        data = request.get_json()
        
        if 'payment_status' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing payment_status field'
            }), 400
        
        billing.payment_status = PaymentStatus(data['payment_status'])
        
        if data['payment_status'] == 'paid' and not billing.payment_time:
            from datetime import datetime
            billing.payment_time = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': billing.to_dict(),
            'message': 'Payment status updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/pending', methods=['GET'])
def get_pending_payments():
    """Get all pending payments"""
    try:
        pending_bills = Billing.query.filter(
            Billing.payment_status == PaymentStatus.PENDING
        ).order_by(Billing.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [bill.to_dict() for bill in pending_bills],
            'count': len(pending_bills)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/revenue', methods=['GET'])
def get_revenue_report():
    """Get revenue report with date filters"""
    try:
        from datetime import datetime
        from sqlalchemy import func
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = Billing.query.filter(Billing.payment_status == PaymentStatus.PAID)
        
        if start_date:
            start_date_obj = datetime.fromisoformat(start_date)
            query = query.filter(Billing.payment_time >= start_date_obj)
        
        if end_date:
            end_date_obj = datetime.fromisoformat(end_date)
            query = query.filter(Billing.payment_time <= end_date_obj)
        
        # Calculate total revenue
        total_revenue = db.session.query(func.sum(Billing.amount)).filter(
            Billing.payment_status == PaymentStatus.PAID
        ).scalar() or 0.0
        
        paid_bills = query.order_by(Billing.payment_time.desc()).all()
        
        return jsonify({
            'success': True,
            'data': {
                'total_revenue': float(total_revenue),
                'transactions': [bill.to_dict() for bill in paid_bills],
                'transaction_count': len(paid_bills)
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500