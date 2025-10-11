"""Vendor model."""
from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class Vendor(Base):
    """Vendor information model."""
    __tablename__ = 'vendors'
    
    id = Column(Integer, primary_key=True, index=True)
    contact_name = Column('name', String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    company = Column(String(255), nullable=True)
    street = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    zip_code = Column(String(50), nullable=True)
    country = Column(String(100), nullable=True)
    tax_id = Column(String(100), nullable=True)
    payment_terms = Column(String(50), nullable=False, default='net30')
    category = Column(String(50), nullable=False, default='other')
    account_number = Column(String(100), nullable=True)
    notes = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(String(50), nullable=True)
