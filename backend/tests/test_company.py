"""Tests for company settings."""
import json


def test_get_company_none(client):
    """Test getting company when none exists."""
    response = client.get('/api/company')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data is None


def test_create_company(client):
    """Test creating company settings."""
    company_data = {
        'name': 'LedgerFlow Inc',
        'contactEmail': 'contact@ledgerflow.com',
        'companyPhone': '555-1000',
        'mailing': {
            'address1': '123 Business St',
            'address2': 'Suite 100',
            'city': 'New York',
            'state': 'NY',
            'postalCode': '10001',
            'country': 'USA'
        },
        'physical': {
            'address1': '456 Office Blvd',
            'address2': '',
            'city': 'New York',
            'state': 'NY',
            'postalCode': '10002',
            'country': 'USA'
        }
    }
    
    response = client.post('/api/company',
                          data=json.dumps(company_data),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    assert 'id' in data


def test_get_company_after_create(client):
    """Test getting company after creating it."""
    company_data = {
        'name': 'Test Company',
        'contactEmail': 'test@company.com'
    }
    client.post('/api/company',
               data=json.dumps(company_data),
               content_type='application/json')
    
    response = client.get('/api/company')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['name'] == 'Test Company'
    assert data['contactEmail'] == 'test@company.com'


def test_update_company(client):
    """Test updating existing company settings."""
    # Create initial company
    initial_data = {
        'name': 'Original Name',
        'contactEmail': 'original@company.com'
    }
    client.post('/api/company',
               data=json.dumps(initial_data),
               content_type='application/json')
    
    # Update company
    update_data = {
        'name': 'Updated Name',
        'contactEmail': 'updated@company.com',
        'companyPhone': '555-2000'
    }
    response = client.post('/api/company',
                          data=json.dumps(update_data),
                          content_type='application/json')
    assert response.status_code == 200
    
    # Verify update
    get_response = client.get('/api/company')
    data = json.loads(get_response.data)
    assert data['name'] == 'Updated Name'
    assert data['contactEmail'] == 'updated@company.com'
    assert data['companyPhone'] == '555-2000'


def test_company_alternative_name_field(client):
    """Test company creation with 'companyName' field."""
    company_data = {
        'companyName': 'Alternative Name Field',
        'contactEmail': 'alt@company.com'
    }
    
    response = client.post('/api/company',
                          data=json.dumps(company_data),
                          content_type='application/json')
    assert response.status_code == 200
    
    # Verify the name was set
    get_response = client.get('/api/company')
    data = json.loads(get_response.data)
    assert data['name'] == 'Alternative Name Field'
