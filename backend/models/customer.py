"""Customer model."""
from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base


class Customer(Base):
    """Customer information model."""
    __tablename__ = 'customers'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    company = Column(String(255), nullable=True)
    street = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    zip_code = Column(String(50), nullable=True)
    country = Column(String(100), nullable=True)
    billing_street = Column(String(255), nullable=True)
    billing_city = Column(String(100), nullable=True)
    billing_state = Column(String(100), nullable=True)
    billing_zip_code = Column(String(50), nullable=True)
    billing_country = Column(String(100), nullable=True)
    tax_id = Column(String(100), nullable=True)
    payment_terms = Column(String(50), nullable=False, default='net30')
    credit_limit = Column(Float, nullable=True)
    notes = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(String(50), nullable=True)
