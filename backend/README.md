# LedgerFlow Backend (Flask + SQLite)

A modular Flask backend for the LedgerFlow accounting application with SQLite database.

## Project Structure

```
backend/
├── app.py              # Main Flask application (46 lines)
├── database.py         # Database configuration (engine, SessionLocal, Base)
├── models.py           # Legacy compatibility - re-exports from models/
├── models/             # SQLAlchemy database models (organized by entity)
│   ├── __init__.py     # Model exports
│   ├── company.py      # Company model
│   ├── customer.py     # Customer model
│   ├── vendor.py       # Vendor model
│   ├── invoice.py      # Invoice and InvoiceItem models
│   ├── tax_settings.py # Tax settings model
│   ├── notification_settings.py # Notification settings model
│   └── security_settings.py     # Security settings model
├── utils.py            # Helper functions (serializers, parsers)
├── routes/             # Modular route blueprints
│   ├── __init__.py     # Blueprint exports
│   ├── health.py       # Health check endpoint
│   ├── customers.py    # Customer CRUD operations
│   ├── vendors.py      # Vendor CRUD operations
│   ├── invoices.py     # Invoice CRUD operations
│   ├── company.py      # Company settings
│   └── settings.py     # Tax, notification, and security settings
└── requirements.txt    # Python dependencies
```

## Setup

1. Create and activate a virtual environment (optional)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server
   ```bash
   python app.py
   ```

## API Endpoints

### Health
- `GET /api/health` - Backend health check

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create a customer
- `PUT /api/customers/<id>` - Update a customer
- `DELETE /api/customers/<id>` - Delete a customer

### Vendors
- `GET /api/vendors` - List all vendors
- `POST /api/vendors` - Create a vendor
- `PUT /api/vendors/<id>` - Update a vendor
- `DELETE /api/vendors/<id>` - Delete a vendor

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/<id>` - Get invoice details
- `POST /api/invoices` - Create an invoice
- `PUT /api/invoices/<id>` - Update an invoice
- `DELETE /api/invoices/<id>` - Delete an invoice

### Company
- `GET /api/company` - Get company information
- `POST /api/company` - Upsert company information

### Settings
- `GET /api/tax-settings` - Get tax settings
- `POST /api/tax-settings` - Update tax settings
- `GET /api/notification-settings` - Get notification settings
- `POST /api/notification-settings` - Update notification settings
- `GET /api/security/settings` - Get security settings
- `POST /api/security/settings` - Update security settings
- `POST /api/security/login` - Login with password
- `POST /api/security/set-password` - Set initial password
- `POST /api/security/change-password` - Change password
- `POST /api/security/verify-token` - Verify JWT token

## Database

The SQLite database (ledgerflow.db) is created automatically in the backend directory on first run.

### Models Architecture

The codebase has been refactored to improve maintainability and scalability:

- **database.py**: Contains all database configuration (engine, SessionLocal, Base, DATABASE_URL)
- **models/**: Directory containing individual model files, each focused on a single entity
- **models.py**: Maintained for backward compatibility - re-exports all models from the models/ package

This structure provides:
- Better separation of concerns
- Easier navigation and maintenance
- Clearer dependencies
- Scalability for adding new models
- Full backward compatibility with existing imports