"""Expense model."""
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Expense(Base):
    """Business expense record."""
    __tablename__ = 'expenses'

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False, default=0.0)
    date = Column(String(50), nullable=False)
    payment_method = Column(String(50), nullable=True)
    reference_number = Column(String(100), nullable=True)
    description = Column(String(500), nullable=True)
    tax_deductible = Column(Boolean, default=False)
    tag = Column(String(255), nullable=True)
    vendor_id = Column(Integer, ForeignKey('vendors.id'), nullable=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=True)
    created_at = Column(String(50), nullable=True)
    updated_at = Column(String(50), nullable=True)

    vendor = relationship('Vendor', lazy='joined')
    customer = relationship('Customer', lazy='joined')
