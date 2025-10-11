"""
Backward compatibility module - re-exports models from new structure.

DEPRECATED: Import from 'models' package directly instead.
This file is maintained for backward compatibility with existing code.
"""
from models import (
    Base,
    SessionLocal,
    engine,
    DATABASE_URL,
    Company,
    TaxSettings,
    NotificationSettings,
    SecuritySettings,
    Customer,
    Vendor,
    Invoice,
    InvoiceItem,
)

__all__ = [
    'Base',
    'SessionLocal',
    'engine',
    'DATABASE_URL',
    'Company',
    'TaxSettings',
    'NotificationSettings',
    'SecuritySettings',
    'Customer',
    'Vendor',
    'Invoice',
    'InvoiceItem',
]