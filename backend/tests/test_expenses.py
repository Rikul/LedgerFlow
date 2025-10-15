"""Tests for expense CRUD operations."""
import json


def test_get_expenses_empty(client):
    """Test getting expenses when none exist."""
    response = client.get('/api/expenses')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data == []


def test_create_expense_minimal(client):
    """Test creating an expense with minimal required fields."""
    expense_data = {
        'type': 'office_supplies',
        'amount': 150.00,
        'date': '2024-01-15'
    }

    response = client.post('/api/expenses',
                          data=json.dumps(expense_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['type'] == 'office_supplies'
    assert data['amount'] == 150.00
    assert data['date'] == '2024-01-15'
    assert data['taxDeductible'] is False
    assert 'id' in data
    assert 'createdAt' in data
    assert 'updatedAt' in data


def test_create_expense_with_all_fields(client):
    """Test creating an expense with all fields populated."""
    expense_data = {
        'type': 'travel',
        'amount': 500.00,
        'date': '2024-02-01',
        'paymentMethod': 'credit_card',
        'referenceNumber': 'REF-12345',
        'description': 'Flight to conference',
        'taxDeductible': True,
        'tag': 'Business Travel'
    }

    response = client.post('/api/expenses',
                          data=json.dumps(expense_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['type'] == 'travel'
    assert data['amount'] == 500.00
    assert data['date'] == '2024-02-01'
    assert data['paymentMethod'] == 'credit_card'
    assert data['referenceNumber'] == 'REF-12345'
    assert data['description'] == 'Flight to conference'
    assert data['taxDeductible'] is True
    assert data['tag'] == 'Business Travel'


def test_create_expense_with_vendor(client):
    """Test creating an expense with vendor relationship."""
    # Create a vendor first
    vendor_data = {
        'company': 'Office Depot',
        'email': 'sales@officedepot.com'
    }
    vendor_response = client.post('/api/vendors',
                                  data=json.dumps(vendor_data),
                                  content_type='application/json')
    vendor_id = json.loads(vendor_response.data)['id']

    # Create expense with vendor
    expense_data = {
        'type': 'office_supplies',
        'amount': 250.00,
        'date': '2024-01-20',
        'vendorId': vendor_id,
        'description': 'Printer paper and toner'
    }

    response = client.post('/api/expenses',
                          data=json.dumps(expense_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['vendorId'] == vendor_id
    assert data['vendor'] is not None
    assert data['vendor']['id'] == vendor_id
    assert data['vendor']['name'] == 'Office Depot'


def test_create_expense_with_customer(client):
    """Test creating an expense with customer relationship."""
    # Create a customer first
    customer_data = {
        'name': 'John Doe',
        'email': 'john@example.com'
    }
    customer_response = client.post('/api/customers',
                                    data=json.dumps(customer_data),
                                    content_type='application/json')
    customer_id = json.loads(customer_response.data)['id']

    # Create expense with customer
    expense_data = {
        'type': 'client_entertainment',
        'amount': 175.00,
        'date': '2024-01-25',
        'customerId': customer_id,
        'description': 'Dinner meeting'
    }

    response = client.post('/api/expenses',
                          data=json.dumps(expense_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['customerId'] == customer_id
    assert data['customer'] is not None
    assert data['customer']['id'] == customer_id
    assert data['customer']['name'] == 'John Doe'


def test_create_expense_missing_required_fields(client):
    """Test creating expense without required fields."""
    # Missing type
    response = client.post('/api/expenses',
                          data=json.dumps({
                              'amount': 100.00,
                              'date': '2024-01-01'
                          }),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

    # Missing amount
    response = client.post('/api/expenses',
                          data=json.dumps({
                              'type': 'supplies',
                              'date': '2024-01-01'
                          }),
                          content_type='application/json')
    assert response.status_code == 400

    # Missing date
    response = client.post('/api/expenses',
                          data=json.dumps({
                              'type': 'supplies',
                              'amount': 100.00
                          }),
                          content_type='application/json')
    assert response.status_code == 400


def test_create_expense_empty_type(client):
    """Test creating expense with empty type string."""
    expense_data = {
        'type': '   ',  # Empty after stripping
        'amount': 100.00,
        'date': '2024-01-01'
    }

    response = client.post('/api/expenses',
                          data=json.dumps(expense_data),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert 'type' in data['error'].lower()


def test_create_expense_zero_or_negative_amount(client):
    """Test creating expense with zero or negative amount."""
    # Zero amount
    response = client.post('/api/expenses',
                          data=json.dumps({
                              'type': 'supplies',
                              'amount': 0.00,
                              'date': '2024-01-01'
                          }),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert 'amount' in data['error'].lower()

    # Negative amount
    response = client.post('/api/expenses',
                          data=json.dumps({
                              'type': 'supplies',
                              'amount': -50.00,
                              'date': '2024-01-01'
                          }),
                          content_type='application/json')
    assert response.status_code == 400


def test_create_expense_invalid_vendor_id(client):
    """Test creating expense with non-existent vendor ID."""
    expense_data = {
        'type': 'supplies',
        'amount': 100.00,
        'date': '2024-01-01',
        'vendorId': 99999  # Non-existent vendor
    }

    response = client.post('/api/expenses',
                          data=json.dumps(expense_data),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert 'vendor' in data['error'].lower()


def test_create_expense_invalid_customer_id(client):
    """Test creating expense with non-existent customer ID."""
    expense_data = {
        'type': 'client_entertainment',
        'amount': 100.00,
        'date': '2024-01-01',
        'customerId': 99999  # Non-existent customer
    }

    response = client.post('/api/expenses',
                          data=json.dumps(expense_data),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert 'customer' in data['error'].lower()


def test_get_expenses_with_data(client):
    """Test getting expenses after creating some."""
    # Create two expenses
    client.post('/api/expenses',
               data=json.dumps({
                   'type': 'supplies',
                   'amount': 100.00,
                   'date': '2024-01-01'
               }),
               content_type='application/json')

    client.post('/api/expenses',
               data=json.dumps({
                   'type': 'travel',
                   'amount': 200.00,
                   'date': '2024-01-02'
               }),
               content_type='application/json')

    response = client.get('/api/expenses')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2


def test_get_expense_by_id(client):
    """Test getting a specific expense by ID."""
    # Create an expense
    create_response = client.post('/api/expenses',
                                  data=json.dumps({
                                      'type': 'utilities',
                                      'amount': 350.00,
                                      'date': '2024-01-10',
                                      'description': 'Monthly electricity'
                                  }),
                                  content_type='application/json')
    expense_id = json.loads(create_response.data)['id']

    # Get the expense
    response = client.get(f'/api/expenses/{expense_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['id'] == expense_id
    assert data['type'] == 'utilities'
    assert data['amount'] == 350.00
    assert data['description'] == 'Monthly electricity'


def test_get_nonexistent_expense(client):
    """Test getting an expense that doesn't exist."""
    response = client.get('/api/expenses/99999')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data


def test_update_expense(client):
    """Test updating an existing expense."""
    # Create an expense
    create_response = client.post('/api/expenses',
                                  data=json.dumps({
                                      'type': 'supplies',
                                      'amount': 100.00,
                                      'date': '2024-01-01',
                                      'description': 'Original description'
                                  }),
                                  content_type='application/json')
    expense_id = json.loads(create_response.data)['id']

    # Update the expense
    update_data = {
        'type': 'office_supplies',
        'amount': 150.00,
        'date': '2024-01-02',
        'description': 'Updated description',
        'tag': 'Office Expenses',
        'taxDeductible': True
    }
    response = client.put(f'/api/expenses/{expense_id}',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['type'] == 'office_supplies'
    assert data['amount'] == 150.00
    assert data['date'] == '2024-01-02'
    assert data['description'] == 'Updated description'
    assert data['tag'] == 'Office Expenses'
    assert data['taxDeductible'] is True


def test_update_expense_add_vendor(client):
    """Test updating an expense to add a vendor."""
    # Create vendor
    vendor_response = client.post('/api/vendors',
                                  data=json.dumps({
                                      'company': 'Staples',
                                      'email': 'sales@staples.com'
                                  }),
                                  content_type='application/json')
    vendor_id = json.loads(vendor_response.data)['id']

    # Create expense without vendor
    create_response = client.post('/api/expenses',
                                  data=json.dumps({
                                      'type': 'supplies',
                                      'amount': 100.00,
                                      'date': '2024-01-01'
                                  }),
                                  content_type='application/json')
    expense_id = json.loads(create_response.data)['id']

    # Update to add vendor
    update_data = {
        'type': 'supplies',
        'amount': 100.00,
        'date': '2024-01-01',
        'vendorId': vendor_id
    }
    response = client.put(f'/api/expenses/{expense_id}',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['vendorId'] == vendor_id
    assert data['vendor']['id'] == vendor_id


def test_update_expense_remove_vendor(client):
    """Test updating an expense to remove a vendor."""
    # Create vendor
    vendor_response = client.post('/api/vendors',
                                  data=json.dumps({
                                      'company': 'Test Vendor',
                                      'email': 'test@vendor.com'
                                  }),
                                  content_type='application/json')
    vendor_id = json.loads(vendor_response.data)['id']

    # Create expense with vendor
    create_response = client.post('/api/expenses',
                                  data=json.dumps({
                                      'type': 'supplies',
                                      'amount': 100.00,
                                      'date': '2024-01-01',
                                      'vendorId': vendor_id
                                  }),
                                  content_type='application/json')
    expense_id = json.loads(create_response.data)['id']

    # Update to remove vendor (set to None/null)
    update_data = {
        'type': 'supplies',
        'amount': 100.00,
        'date': '2024-01-01',
        'vendorId': None
    }
    response = client.put(f'/api/expenses/{expense_id}',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['vendorId'] is None
    assert data['vendor'] is None


def test_update_nonexistent_expense(client):
    """Test updating an expense that doesn't exist."""
    response = client.put('/api/expenses/99999',
                         data=json.dumps({
                             'type': 'supplies',
                             'amount': 100.00,
                             'date': '2024-01-01'
                         }),
                         content_type='application/json')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data


def test_update_expense_invalid_data(client):
    """Test updating expense with invalid data."""
    # Create an expense
    create_response = client.post('/api/expenses',
                                  data=json.dumps({
                                      'type': 'supplies',
                                      'amount': 100.00,
                                      'date': '2024-01-01'
                                  }),
                                  content_type='application/json')
    expense_id = json.loads(create_response.data)['id']

    # Update with zero amount
    response = client.put(f'/api/expenses/{expense_id}',
                         data=json.dumps({
                             'type': 'supplies',
                             'amount': 0.00,
                             'date': '2024-01-01'
                         }),
                         content_type='application/json')
    assert response.status_code == 400

    # Update with invalid vendor ID
    response = client.put(f'/api/expenses/{expense_id}',
                         data=json.dumps({
                             'type': 'supplies',
                             'amount': 100.00,
                             'date': '2024-01-01',
                             'vendorId': 99999
                         }),
                         content_type='application/json')
    assert response.status_code == 400


def test_delete_expense(client):
    """Test deleting an expense."""
    # Create an expense
    create_response = client.post('/api/expenses',
                                  data=json.dumps({
                                      'type': 'supplies',
                                      'amount': 100.00,
                                      'date': '2024-01-01'
                                  }),
                                  content_type='application/json')
    expense_id = json.loads(create_response.data)['id']

    # Delete the expense
    response = client.delete(f'/api/expenses/{expense_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'

    # Verify deletion
    get_response = client.get('/api/expenses')
    expenses = json.loads(get_response.data)
    assert len(expenses) == 0


def test_delete_nonexistent_expense(client):
    """Test deleting an expense that doesn't exist."""
    response = client.delete('/api/expenses/99999')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data


def test_expense_with_both_vendor_and_customer(client):
    """Test creating expense with both vendor and customer."""
    # Create vendor and customer
    vendor_response = client.post('/api/vendors',
                                  data=json.dumps({
                                      'company': 'Catering Co',
                                      'email': 'info@catering.com'
                                  }),
                                  content_type='application/json')
    vendor_id = json.loads(vendor_response.data)['id']

    customer_response = client.post('/api/customers',
                                    data=json.dumps({
                                        'name': 'Client Name',
                                        'email': 'client@example.com'
                                    }),
                                    content_type='application/json')
    customer_id = json.loads(customer_response.data)['id']

    # Create expense with both
    expense_data = {
        'type': 'client_entertainment',
        'amount': 300.00,
        'date': '2024-01-15',
        'vendorId': vendor_id,
        'customerId': customer_id,
        'description': 'Client lunch at catering venue'
    }

    response = client.post('/api/expenses',
                          data=json.dumps(expense_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['vendorId'] == vendor_id
    assert data['customerId'] == customer_id
    assert data['vendor'] is not None
    assert data['customer'] is not None
