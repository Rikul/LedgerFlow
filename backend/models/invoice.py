"""Invoice and InvoiceItem models."""
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Invoice(Base):
    """Invoice model."""
    __tablename__ = 'invoices'

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), nullable=False, unique=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    status = Column(String(20), default='draft')
    issue_date = Column(String(50), nullable=True)
    due_date = Column(String(50), nullable=True)
    payment_terms = Column(String(50), nullable=True)
    notes = Column(String(500), nullable=True)
    terms = Column(String(500), nullable=True)
    tax_rate = Column(Float, default=0.0)
    subtotal = Column(Float, default=0.0)
    tax_total = Column(Float, default=0.0)
    discount_total = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    created_at = Column(String(50), nullable=True)
    updated_at = Column(String(50), nullable=True)

    customer = relationship('Customer')
    items = relationship('InvoiceItem', cascade='all, delete-orphan', lazy='joined', back_populates='invoice')


class InvoiceItem(Base):
    """Invoice line item model."""
    __tablename__ = 'invoice_items'

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey('invoices.id', ondelete='CASCADE'), nullable=False)
    description = Column(String(255), nullable=False)
    quantity = Column(Float, default=1.0)
    rate = Column(Float, default=0.0)

    invoice = relationship('Invoice', back_populates='items')
