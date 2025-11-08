"""Payment model."""
from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Payment(Base):
    """Represents a payment that can be linked to invoices, vendors or customers."""

    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False, default=0.0)
    date = Column(String(50), nullable=False)
    payment_method = Column(String(50), nullable=True)
    reference_number = Column(String(100), nullable=True)
    notes = Column(String(500), nullable=True)
    invoice_id = Column(Integer, ForeignKey('invoices.id'), nullable=True)
    vendor_id = Column(Integer, ForeignKey('vendors.id'), nullable=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=True)
    created_at = Column(String(50), nullable=True)
    updated_at = Column(String(50), nullable=True)

    invoice = relationship('Invoice', lazy='joined')
    vendor = relationship('Vendor', lazy='joined')
    customer = relationship('Customer', lazy='joined')
