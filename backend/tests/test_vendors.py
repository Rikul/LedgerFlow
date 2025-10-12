"""Tests for vendor CRUD operations."""
import json


def test_get_vendors_empty(client):
    """Test getting vendors when none exist."""
    response = client.get('/api/vendors')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data == []


def test_create_vendor(client):
    """Test creating a new vendor."""
    vendor_data = {
        'company': 'Tech Supplies Inc',
        'contact': 'Bob Johnson',
        'email': 'bob@techsupplies.com',
        'phone': '555-5678',
        'address': {
            'street': '789 Industrial Rd',
            'city': 'Detroit',
            'state': 'MI',
            'zipCode': '48201',
            'country': 'USA'
        },
        'taxId': 'VENDOR123',
        'paymentTerms': 'net45',
        'category': 'supplies',
        'accountNumber': 'ACC-1234',
        'notes': 'Preferred supplier',
        'isActive': True
    }
    
    response = client.post('/api/vendors',
                          data=json.dumps(vendor_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    assert 'id' in data


def test_create_vendor_missing_required_fields(client):
    """Test creating vendor without required fields."""
    # Missing email
    response = client.post('/api/vendors',
                          data=json.dumps({'company': 'Test Corp'}),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    
    # Missing company
    response = client.post('/api/vendors',
                          data=json.dumps({'email': 'test@example.com'}),
                          content_type='application/json')
    assert response.status_code == 400


def test_get_vendors_with_data(client):
    """Test getting vendors after creating one."""
    vendor_data = {
        'company': 'Office Supplies Co',
        'email': 'office@supplies.com'
    }
    client.post('/api/vendors',
               data=json.dumps(vendor_data),
               content_type='application/json')
    
    response = client.get('/api/vendors')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]['company'] == 'Office Supplies Co'
    assert data[0]['email'] == 'office@supplies.com'


def test_update_vendor(client):
    """Test updating an existing vendor."""
    # Create a vendor first
    create_response = client.post('/api/vendors',
                                  data=json.dumps({
                                      'company': 'Original Company',
                                      'email': 'original@company.com'
                                  }),
                                  content_type='application/json')
    vendor_id = json.loads(create_response.data)['id']
    
    # Update the vendor
    update_data = {
        'company': 'Updated Company',
        'email': 'updated@company.com',
        'phone': '555-8888'
    }
    response = client.put(f'/api/vendors/{vendor_id}',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    
    # Verify the update
    get_response = client.get('/api/vendors')
    vendors = json.loads(get_response.data)
    assert vendors[0]['company'] == 'Updated Company'
    assert vendors[0]['email'] == 'updated@company.com'


def test_update_nonexistent_vendor(client):
    """Test updating a vendor that doesn't exist."""
    response = client.put('/api/vendors/999',
                         data=json.dumps({
                             'company': 'Test',
                             'email': 'test@example.com'
                         }),
                         content_type='application/json')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data


def test_delete_vendor(client):
    """Test deleting a vendor."""
    # Create a vendor first
    create_response = client.post('/api/vendors',
                                  data=json.dumps({
                                      'company': 'To Delete',
                                      'email': 'delete@vendor.com'
                                  }),
                                  content_type='application/json')
    vendor_id = json.loads(create_response.data)['id']
    
    # Delete the vendor
    response = client.delete(f'/api/vendors/{vendor_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    
    # Verify deletion
    get_response = client.get('/api/vendors')
    vendors = json.loads(get_response.data)
    assert len(vendors) == 0


def test_delete_nonexistent_vendor(client):
    """Test deleting a vendor that doesn't exist."""
    response = client.delete('/api/vendors/999')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data
