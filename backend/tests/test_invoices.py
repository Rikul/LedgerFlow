"""Tests for invoice CRUD operations."""
import json


def test_get_invoices_empty(client):
    """Test getting invoices when none exist."""
    response = client.get('/api/invoices')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data == []


def test_create_invoice_requires_customer(client):
    """Test creating an invoice requires a customer first."""
    # Create a customer first
    customer_data = {
        'name': 'Invoice Customer',
        'email': 'invoice@customer.com'
    }
    customer_response = client.post('/api/customers',
                                    data=json.dumps(customer_data),
                                    content_type='application/json')
    customer_id = json.loads(customer_response.data)['id']
    
    # Now create an invoice
    invoice_data = {
        'invoiceNumber': 'INV-001',
        'customerId': customer_id,
        'status': 'draft',
        'issueDate': '2024-01-01',
        'dueDate': '2024-01-31',
        'paymentTerms': 'net30',
        'lineItems': [
            {
                'description': 'Consulting Services',
                'quantity': 10,
                'rate': 100.00,
                'taxRate': 10.0
            },
            {
                'description': 'Software License',
                'quantity': 1,
                'rate': 500.00,
                'taxRate': 10.0
            }
        ],
        'notes': 'Thank you for your business',
        'terms': 'Payment due within 30 days'
    }
    
    response = client.post('/api/invoices',
                          data=json.dumps(invoice_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['invoiceNumber'] == 'INV-001'
    assert data['customerId'] == customer_id
    assert data['subtotal'] == 1500.0  # 10*100 + 1*500
    assert data['taxTotal'] == 150.0   # 10% of 1500
    assert data['total'] == 1650.0


def test_create_invoice_missing_required_fields(client):
    """Test creating invoice without required fields."""
    # Missing invoice number
    response = client.post('/api/invoices',
                          data=json.dumps({'customerId': 1}),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    
    # Missing customer ID
    response = client.post('/api/invoices',
                          data=json.dumps({'invoiceNumber': 'INV-002'}),
                          content_type='application/json')
    assert response.status_code == 400


def test_create_invoice_with_discount(client):
    """Test creating invoice with discount."""
    # Create customer
    customer_response = client.post('/api/customers',
                                    data=json.dumps({
                                        'name': 'Discount Customer',
                                        'email': 'discount@customer.com'
                                    }),
                                    content_type='application/json')
    customer_id = json.loads(customer_response.data)['id']
    
    # Create invoice with discount
    invoice_data = {
        'invoiceNumber': 'INV-DISC-001',
        'customerId': customer_id,
        'lineItems': [
            {
                'description': 'Product',
                'quantity': 1,
                'rate': 1000.00,
                'taxRate': 0
            }
        ],
        'discountTotal': 100.00
    }
    
    response = client.post('/api/invoices',
                          data=json.dumps(invoice_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['subtotal'] == 1000.0
    assert data['discountTotal'] == 100.0
    assert data['total'] == 900.0  # 1000 - 100


def test_get_invoice_by_id(client):
    """Test getting a specific invoice by ID."""
    # Create customer and invoice
    customer_response = client.post('/api/customers',
                                    data=json.dumps({
                                        'name': 'Test Customer',
                                        'email': 'test@customer.com'
                                    }),
                                    content_type='application/json')
    customer_id = json.loads(customer_response.data)['id']
    
    invoice_response = client.post('/api/invoices',
                                   data=json.dumps({
                                       'invoiceNumber': 'INV-GET-001',
                                       'customerId': customer_id,
                                       'lineItems': []
                                   }),
                                   content_type='application/json')
    invoice_id = json.loads(invoice_response.data)['id']
    
    # Get the invoice
    response = client.get(f'/api/invoices/{invoice_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['id'] == invoice_id
    assert data['invoiceNumber'] == 'INV-GET-001'


def test_get_nonexistent_invoice(client):
    """Test getting an invoice that doesn't exist."""
    response = client.get('/api/invoices/999')
    assert response.status_code == 404
    data = json.loads(response.data)
    assert 'error' in data


def test_update_invoice(client):
    """Test updating an existing invoice."""
    # Create customer and invoice
    customer_response = client.post('/api/customers',
                                    data=json.dumps({
                                        'name': 'Update Customer',
                                        'email': 'update@customer.com'
                                    }),
                                    content_type='application/json')
    customer_id = json.loads(customer_response.data)['id']
    
    invoice_response = client.post('/api/invoices',
                                   data=json.dumps({
                                       'invoiceNumber': 'INV-UPD-001',
                                       'customerId': customer_id,
                                       'status': 'draft',
                                       'lineItems': [
                                           {
                                               'description': 'Original Item',
                                               'quantity': 1,
                                               'rate': 100.00,
                                               'taxRate': 0
                                           }
                                       ]
                                   }),
                                   content_type='application/json')
    invoice_id = json.loads(invoice_response.data)['id']
    
    # Update the invoice
    update_data = {
        'invoiceNumber': 'INV-UPD-001',
        'customerId': customer_id,
        'status': 'sent',
        'lineItems': [
            {
                'description': 'Updated Item',
                'quantity': 2,
                'rate': 150.00,
                'taxRate': 0
            }
        ]
    }
    response = client.put(f'/api/invoices/{invoice_id}',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'sent'
    assert data['subtotal'] == 300.0  # 2 * 150


def test_update_nonexistent_invoice(client):
    """Test updating an invoice that doesn't exist."""
    response = client.put('/api/invoices/999',
                         data=json.dumps({
                             'invoiceNumber': 'INV-999',
                             'customerId': 1
                         }),
                         content_type='application/json')
    assert response.status_code == 404


def test_delete_invoice(client):
    """Test deleting an invoice."""
    # Create customer and invoice
    customer_response = client.post('/api/customers',
                                    data=json.dumps({
                                        'name': 'Delete Customer',
                                        'email': 'delete@customer.com'
                                    }),
                                    content_type='application/json')
    customer_id = json.loads(customer_response.data)['id']
    
    invoice_response = client.post('/api/invoices',
                                   data=json.dumps({
                                       'invoiceNumber': 'INV-DEL-001',
                                       'customerId': customer_id,
                                       'lineItems': []
                                   }),
                                   content_type='application/json')
    invoice_id = json.loads(invoice_response.data)['id']
    
    # Delete the invoice
    response = client.delete(f'/api/invoices/{invoice_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    
    # Verify deletion
    get_response = client.get('/api/invoices')
    invoices = json.loads(get_response.data)
    assert len(invoices) == 0


def test_delete_nonexistent_invoice(client):
    """Test deleting an invoice that doesn't exist."""
    response = client.delete('/api/invoices/999')
    assert response.status_code == 404


def test_invoice_status_normalization(client):
    """Test that invoice status is normalized correctly."""
    # Create customer
    customer_response = client.post('/api/customers',
                                    data=json.dumps({
                                        'name': 'Status Customer',
                                        'email': 'status@customer.com'
                                    }),
                                    content_type='application/json')
    customer_id = json.loads(customer_response.data)['id']
    
    # Create invoice with uppercase status
    invoice_data = {
        'invoiceNumber': 'INV-STATUS-001',
        'customerId': customer_id,
        'status': 'PAID',
        'lineItems': []
    }
    
    response = client.post('/api/invoices',
                          data=json.dumps(invoice_data),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'paid'  # Should be normalized to lowercase
