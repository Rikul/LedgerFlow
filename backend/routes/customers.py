"""Customer CRUD routes."""
import datetime
from flask import Blueprint, jsonify, request
from models import SessionLocal, Customer

customers_bp = Blueprint('customers', __name__)


@customers_bp.get('/api/customers')
def get_customers():
    db = SessionLocal()
    customers = db.query(Customer).all()
    result = []
    for c in customers:
        result.append({
            'id': c.id,
            'name': c.name,
            'email': c.email,
            'phone': c.phone,
            'company': c.company,
            'address': {
                'street': c.street,
                'city': c.city,
                'state': c.state,
                'zipCode': c.zip_code,
                'country': c.country,
            },
            'billingAddress': {
                'street': c.billing_street,
                'city': c.billing_city,
                'state': c.billing_state,
                'zipCode': c.billing_zip_code,
                'country': c.billing_country,
            },
            'taxId': c.tax_id,
            'paymentTerms': c.payment_terms,
            'creditLimit': c.credit_limit,
            'notes': c.notes,
            'isActive': c.is_active,
            'createdAt': c.created_at
        })
    return jsonify(result), 200


@customers_bp.post('/api/customers')
def create_customer():
    db = SessionLocal()
    data = request.get_json(force=True) or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400
    credit_limit = data.get('creditLimit')
    try:
        credit_limit = float(credit_limit) if credit_limit not in (None, '') else None
    except (TypeError, ValueError):
        credit_limit = None
    customer = Customer(
        name=name,
        email=email,
        phone=data.get('phone'),
        company=data.get('company'),
        street=data.get('address', {}).get('street'),
        city=data.get('address', {}).get('city'),
        state=data.get('address', {}).get('state'),
        zip_code=data.get('address', {}).get('zipCode'),
        country=data.get('address', {}).get('country'),
        billing_street=data.get('billingAddress', {}).get('street'),
        billing_city=data.get('billingAddress', {}).get('city'),
        billing_state=data.get('billingAddress', {}).get('state'),
        billing_zip_code=data.get('billingAddress', {}).get('zipCode'),
        billing_country=data.get('billingAddress', {}).get('country'),
        tax_id=data.get('taxId'),
        payment_terms=data.get('paymentTerms', 'net30'),
        credit_limit=credit_limit,
        notes=data.get('notes'),
        is_active=data.get('isActive', True),
        created_at=datetime.datetime.utcnow().isoformat()
    )
    db.add(customer)
    db.commit()
    return jsonify({'status': 'ok', 'id': customer.id}), 201


@customers_bp.put('/api/customers/<int:customer_id>')
def update_customer(customer_id):
    db = SessionLocal()
    data = request.get_json(force=True) or {}
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400
    customer.name = name
    customer.email = email
    customer.phone = data.get('phone')
    customer.company = data.get('company')
    customer.street = data.get('address', {}).get('street')
    customer.city = data.get('address', {}).get('city')
    customer.state = data.get('address', {}).get('state')
    customer.zip_code = data.get('address', {}).get('zipCode')
    customer.country = data.get('address', {}).get('country')
    customer.billing_street = data.get('billingAddress', {}).get('street')
    customer.billing_city = data.get('billingAddress', {}).get('city')
    customer.billing_state = data.get('billingAddress', {}).get('state')
    customer.billing_zip_code = data.get('billingAddress', {}).get('zipCode')
    customer.billing_country = data.get('billingAddress', {}).get('country')
    customer.tax_id = data.get('taxId')
    customer.payment_terms = data.get('paymentTerms', 'net30')
    credit_limit = data.get('creditLimit')
    try:
        credit_limit = float(credit_limit) if credit_limit not in (None, '') else None
    except (TypeError, ValueError):
        credit_limit = None
    customer.credit_limit = credit_limit
    customer.notes = data.get('notes')
    customer.is_active = data.get('isActive', True)
    db.commit()
    return jsonify({'status': 'ok', 'id': customer.id}), 200


@customers_bp.delete('/api/customers/<int:customer_id>')
def delete_customer(customer_id):
    db = SessionLocal()
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    db.delete(customer)
    db.commit()
    return jsonify({'status': 'ok'}), 200
