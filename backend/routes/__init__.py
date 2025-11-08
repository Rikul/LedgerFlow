"""Routes package for LedgerFlow backend."""
from routes.health import health_bp
from routes.customers import customers_bp
from routes.vendors import vendors_bp
from routes.invoices import invoices_bp
from routes.expenses import expenses_bp
from routes.payments import payments_bp
from routes.company import company_bp
from routes.settings import settings_bp

__all__ = [
    'health_bp',
    'customers_bp',
    'vendors_bp',
    'invoices_bp',
    'expenses_bp',
    'payments_bp',
    'company_bp',
    'settings_bp',
]
