"""Tests for payment endpoints."""
import json


def _create_customer(client, name='Test Customer', email='customer@example.com'):
    response = client.post(
        '/api/customers',
        data=json.dumps({'name': name, 'email': email}),
        content_type='application/json',
    )
    assert response.status_code == 201
    return json.loads(response.data)


def _create_vendor(client, company='Test Vendor', email='vendor@example.com'):
    response = client.post(
        '/api/vendors',
        data=json.dumps({'company': company, 'email': email}),
        content_type='application/json',
    )
    assert response.status_code == 201
    return json.loads(response.data)


def _create_invoice(client, customer_id, invoice_number='INV-1001'):
    payload = {
        'invoiceNumber': invoice_number,
        'customerId': customer_id,
        'status': 'sent',
        'issueDate': '2024-03-01',
        'dueDate': '2024-03-15',
        'lineItems': [
            {'description': 'Consulting', 'quantity': 5, 'rate': 100},
        ],
    }
    response = client.post(
        '/api/invoices',
        data=json.dumps(payload),
        content_type='application/json',
    )
    assert response.status_code == 201
    return json.loads(response.data)


def test_list_payments_initial_empty(client):
    """Payments list should be empty initially."""
    response = client.get('/api/payments')
    assert response.status_code == 200
    assert json.loads(response.data) == []


def test_create_payment_minimal(client):
    """Creating a minimal payment requires amount and date."""
    payload = {
        'amount': 250.75,
        'date': '2024-03-10',
    }
    response = client.post('/api/payments', data=json.dumps(payload), content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['amount'] == 250.75
    assert data['date'] == '2024-03-10'
    assert data['vendor'] is None
    assert data['customer'] is None
    assert data['invoice'] is None


def test_create_payment_with_associations(client):
    """Payments can be linked to invoices, customers and vendors."""
    customer = _create_customer(client, name='Acme Corp', email='billing@acme.test')
    vendor = _create_vendor(client, company='Supplier Inc', email='sales@supplier.test')
    invoice = _create_invoice(client, customer_id=customer['id'], invoice_number='INV-2001')

    payload = {
        'amount': 500.0,
        'date': '2024-03-12',
        'paymentMethod': 'bank_transfer',
        'referenceNumber': 'PAY-500',
        'invoiceId': invoice['id'],
        'customerId': customer['id'],
        'vendorId': vendor['id'],
        'notes': 'Partial payment',
    }
    response = client.post('/api/payments', data=json.dumps(payload), content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['invoice']['id'] == invoice['id']
    assert data['invoice']['invoiceNumber'] == 'INV-2001'
    assert data['customer']['id'] == customer['id']
    assert data['vendor']['id'] == vendor['id']
    assert data['paymentMethod'] == 'bank_transfer'


def test_update_and_delete_payment(client):
    """Payments can be updated and deleted."""
    # Create a base payment
    payload = {
        'amount': 120.0,
        'date': '2024-03-05',
        'paymentMethod': 'cash',
    }
    response = client.post('/api/payments', data=json.dumps(payload), content_type='application/json')
    assert response.status_code == 201
    payment = json.loads(response.data)

    # Update payment
    update_payload = {
        'amount': 150.0,
        'date': '2024-03-06',
        'paymentMethod': 'credit_card',
        'notes': 'Updated payment details',
    }
    update_response = client.put(
        f"/api/payments/{payment['id']}",
        data=json.dumps(update_payload),
        content_type='application/json',
    )
    assert update_response.status_code == 200
    updated = json.loads(update_response.data)
    assert updated['amount'] == 150.0
    assert updated['paymentMethod'] == 'credit_card'
    assert updated['notes'] == 'Updated payment details'

    # Delete payment
    delete_response = client.delete(f"/api/payments/{payment['id']}")
    assert delete_response.status_code == 200
    assert json.loads(delete_response.data)['status'] == 'ok'

    # Ensure it is gone
    get_response = client.get(f"/api/payments/{payment['id']}")
    assert get_response.status_code == 404
