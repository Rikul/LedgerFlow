"""Tests for customer CRUD operations."""
import json


def test_get_customers_empty(client):
    """Test getting customers when none exist."""
    response = client.get('/api/customers')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data == []


def test_create_customer(client):
    """Test creating a new customer."""
    customer_data = {
        'name': 'John Doe',
        'email': 'john@example.com',
        'phone': '555-1234',
        'company': 'Acme Corp',
        'address': {
            'street': '123 Main St',
            'city': 'Springfield',
            'state': 'IL',
            'zipCode': '62701',
            'country': 'USA'
        },
        'billingAddress': {
            'street': '456 Billing Ave',
            'city': 'Chicago',
            'state': 'IL',
            'zipCode': '60601',
            'country': 'USA'
        },
        'taxId': 'TAX123',
        'paymentTerms': 'net30',
        'creditLimit': 5000.00,
        'notes': 'VIP customer',
        'isActive': True
    }
    
    response = client.post('/api/customers', 
                          data=json.dumps(customer_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    assert 'id' in data


def test_create_customer_missing_required_fields(client):
    """Test creating customer without required fields."""
    # Missing email
    response = client.post('/api/customers',
                          data=json.dumps({'name': 'John Doe'}),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    
    # Missing name
    response = client.post('/api/customers',
                          data=json.dumps({'email': 'john@example.com'}),
                          content_type='application/json')
    assert response.status_code == 400


def test_get_customers_with_data(client):
    """Test getting customers after creating one."""
    customer_data = {
        'name': 'Jane Smith',
        'email': 'jane@example.com'
    }
    client.post('/api/customers',
               data=json.dumps(customer_data),
               content_type='application/json')
    
    response = client.get('/api/customers')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]['name'] == 'Jane Smith'
    assert data[0]['email'] == 'jane@example.com'


def test_update_customer(client):
    """Test updating an existing customer."""
    # Create a customer first
    create_response = client.post('/api/customers',
                                  data=json.dumps({
                                      'name': 'Original Name',
                                      'email': 'original@example.com'
                                  }),
                                  content_type='application/json')
    customer_id = json.loads(create_response.data)['id']
    
    # Update the customer
    update_data = {
        'name': 'Updated Name',
        'email': 'updated@example.com',
        'phone': '555-9999'
    }
    response = client.put(f'/api/customers/{customer_id}',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    
    # Verify the update
    get_response = client.get('/api/customers')
    customers = json.loads(get_response.data)
    assert customers[0]['name'] == 'Updated Name'
    assert customers[0]['email'] == 'updated@example.com'


def test_update_nonexistent_customer(client):
    """Test updating a customer that doesn't exist."""
    response = client.put('/api/customers/999',
                         data=json.dumps({
                             'name': 'Test',
                             'email': 'test@example.com'
                         }),
                         content_type='application/json')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data


def test_delete_customer(client):
    """Test deleting a customer."""
    # Create a customer first
    create_response = client.post('/api/customers',
                                  data=json.dumps({
                                      'name': 'To Delete',
                                      'email': 'delete@example.com'
                                  }),
                                  content_type='application/json')
    customer_id = json.loads(create_response.data)['id']
    
    # Delete the customer
    response = client.delete(f'/api/customers/{customer_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    
    # Verify deletion
    get_response = client.get('/api/customers')
    customers = json.loads(get_response.data)
    assert len(customers) == 0


def test_delete_nonexistent_customer(client):
    """Test deleting a customer that doesn't exist."""
    response = client.delete('/api/customers/999')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data
