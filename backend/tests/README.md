# Backend Tests

This directory contains comprehensive tests for the LedgerFlow backend API.

## Running Tests

To run all tests:

```bash
cd backend
python -m pytest tests/ -v
```

To run specific test files:

```bash
python -m pytest tests/test_health.py -v
python -m pytest tests/test_customers.py -v
```

To run tests with coverage:

```bash
python -m pytest tests/ --cov=. --cov-report=html
```

## Test Structure

- `conftest.py` - Pytest fixtures and configuration (test app, test client)
- `test_health.py` - Health check endpoint tests
- `test_utils.py` - Utility function tests (parse_float, normalize_status, serialize_invoice)
- `test_customers.py` - Customer CRUD operation tests
- `test_vendors.py` - Vendor CRUD operation tests
- `test_company.py` - Company settings tests
- `test_invoices.py` - Invoice CRUD and calculation tests
- `test_settings.py` - Tax, notification, and security settings tests

## Test Coverage

The test suite covers:

### Health Check (1 test)
- Health endpoint returns correct status

### Utils (5 tests)
- Float parsing with valid/invalid inputs
- Status normalization with valid/invalid values
- Custom allowed statuses

### Customers (8 tests)
- Get empty customer list
- Create customer with full data
- Create customer with missing required fields
- Get customers after creation
- Update existing customer
- Update non-existent customer (error case)
- Delete customer
- Delete non-existent customer (error case)

### Vendors (8 tests)
- Get empty vendor list
- Create vendor with full data
- Create vendor with missing required fields
- Get vendors after creation
- Update existing vendor
- Update non-existent vendor (error case)
- Delete vendor
- Delete non-existent vendor (error case)

### Company (5 tests)
- Get company when none exists
- Create company settings
- Get company after creation
- Update company settings
- Alternative name field handling

### Invoices (11 tests)
- Get empty invoice list
- Create invoice with customer and line items
- Create invoice with missing required fields
- Create invoice with discount
- Get invoice by ID
- Get non-existent invoice (error case)
- Update existing invoice
- Update non-existent invoice (error case)
- Delete invoice
- Delete non-existent invoice (error case)
- Invoice status normalization

### Settings (19 tests)
#### Tax Settings
- Get tax settings when none exist
- Create tax settings
- Get tax settings after creation
- Update tax settings

#### Notification Settings
- Get notification settings when none exist
- Create notification settings
- Get notification settings after creation

#### Security Settings
- Get security settings when none exist
- Create security settings
- Set initial password
- Prevent setting password twice
- Login with valid password
- Login with invalid password
- Login when no password set
- Verify valid JWT token
- Verify invalid token
- Change password
- Change password with wrong current password
- Change password with missing fields

## Test Database

Tests use an isolated SQLite database that is created and destroyed for each test function. This ensures:

1. Tests don't interfere with each other
2. Tests don't affect the production database
3. Each test starts with a clean slate

## Dependencies

Test dependencies are included in `requirements.txt`:
- `pytest==7.4.3` - Testing framework
- `pytest-flask==1.3.0` - Flask testing utilities
