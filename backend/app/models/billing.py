from app.extensions import db
from app.models.base import BaseModel
import enum

class PaymentStatus(enum.Enum):
    PENDING = 'pending'
    PAID = 'paid'
    FAILED = 'failed'

class Billing(BaseModel):
    __tablename__ = 'billing'
    
    id = db.Column(db.Integer, primary_key=True)
    occupancy_id = db.Column(db.Integer, db.ForeignKey('occupancies.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_time = db.Column(db.DateTime)
    payment_status = db.Column(db.Enum(PaymentStatus), default=PaymentStatus.PENDING)
    
    def to_dict(self):
        return {
            'id': self.id,
            'occupancy_id': self.occupancy_id,
            'amount': float(self.amount),
            'payment_time': self.payment_time.isoformat() if self.payment_time else None,
            'payment_status': self.payment_status.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Billing {self.id} - {self.payment_status.value}>'