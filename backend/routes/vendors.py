"""Vendor CRUD routes."""
import datetime
from flask import Blueprint, jsonify, request
from models import SessionLocal, Vendor

vendors_bp = Blueprint('vendors', __name__)


@vendors_bp.get('/api/vendors')
def get_vendors():
    db = SessionLocal()
    vendors = db.query(Vendor).all()
    result = []
    for v in vendors:
        address = {
            'street': v.street,
            'city': v.city,
            'state': v.state,
            'zipCode': v.zip_code,
            'country': v.country,
        }
        if not any(address.values()):
            address = None

        result.append({
            'id': v.id,
            'company': (v.company or '').strip(),
            'contact': (v.contact_name or '').strip() or None,
            'email': v.email,
            'phone': v.phone,
            'address': address,
            'taxId': v.tax_id,
            'paymentTerms': v.payment_terms,
            'category': v.category,
            'accountNumber': v.account_number,
            'notes': v.notes,
            'isActive': v.is_active,
            'createdAt': v.created_at
        })
    return jsonify(result), 200


@vendors_bp.post('/api/vendors')
def create_vendor():
    db = SessionLocal()
    data = request.get_json(force=True) or {}
    company = (data.get('company') or data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    if not company or not email:
        return jsonify({'error': 'Company and email are required'}), 400
    contact = (data.get('contact') or data.get('contactName') or '').strip()
    vendor = Vendor(
        contact_name=contact or None,
        email=email,
        phone=data.get('phone'),
        company=company,
        street=data.get('address', {}).get('street'),
        city=data.get('address', {}).get('city'),
        state=data.get('address', {}).get('state'),
        zip_code=data.get('address', {}).get('zipCode'),
        country=data.get('address', {}).get('country'),
        tax_id=data.get('taxId'),
        payment_terms=data.get('paymentTerms', 'net30'),
        category=data.get('category', 'other'),
        account_number=data.get('accountNumber'),
        notes=data.get('notes'),
        is_active=data.get('isActive', True),
        created_at=datetime.datetime.utcnow().isoformat()
    )
    db.add(vendor)
    db.commit()
    return jsonify({'status': 'ok', 'id': vendor.id}), 201


@vendors_bp.put('/api/vendors/<int:vendor_id>')
def update_vendor(vendor_id):
    db = SessionLocal()
    data = request.get_json(force=True) or {}
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        return jsonify({'error': 'Vendor not found'}), 404
    company = (data.get('company') or data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    if not company or not email:
        return jsonify({'error': 'Company and email are required'}), 400
    contact = (data.get('contact') or data.get('contactName') or '').strip()
    vendor.contact_name = contact or None
    vendor.email = email
    vendor.phone = data.get('phone')
    vendor.company = company
    vendor.street = data.get('address', {}).get('street')
    vendor.city = data.get('address', {}).get('city')
    vendor.state = data.get('address', {}).get('state')
    vendor.zip_code = data.get('address', {}).get('zipCode')
    vendor.country = data.get('address', {}).get('country')
    vendor.tax_id = data.get('taxId')
    vendor.payment_terms = data.get('paymentTerms', 'net30')
    vendor.category = data.get('category', 'other')
    vendor.account_number = data.get('accountNumber')
    vendor.notes = data.get('notes')
    vendor.is_active = data.get('isActive', True)
    db.commit()
    return jsonify({'status': 'ok', 'id': vendor.id}), 200


@vendors_bp.delete('/api/vendors/<int:vendor_id>')
def delete_vendor(vendor_id):
    db = SessionLocal()
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        return jsonify({'error': 'Vendor not found'}), 404
    db.delete(vendor)
    db.commit()
    return jsonify({'status': 'ok'}), 200
