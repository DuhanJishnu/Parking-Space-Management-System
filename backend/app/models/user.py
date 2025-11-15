from app.extensions import db
from app.models.base import BaseModel
import enum

class UserRole(enum.Enum):
    ADMIN = 'admin'
    STAFF = 'staff'
    CUSTOMER = 'customer'

class User(BaseModel):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_no = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200))
    role = db.Column(db.Enum(UserRole), default=UserRole.CUSTOMER)
    
    # Relationships
    vehicles = db.relationship('Vehicle', backref='owner', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_no': self.contact_no,
            'address': self.address,
            'role': self.role.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<User {self.name} - {self.role.value}>'