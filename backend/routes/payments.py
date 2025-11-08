"""Payment routes."""
import datetime
from typing import Any, Dict, Optional

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from models import SessionLocal, Payment, Invoice, Vendor, Customer

payments_bp = Blueprint('payments', __name__)


def _serialize_party(party: Any, party_type: str) -> Optional[Dict[str, Any]]:
    """Serialize a vendor or customer record."""
    if not party:
        return None
    if party_type == 'vendor':
        name = (party.company or party.contact_name or '').strip()
        email = (party.email or '').strip() or None
        return {
            'id': party.id,
            'name': name or 'Unnamed Vendor',
            'company': party.company,
            'contact': party.contact_name,
            'email': email,
        }
    name = (party.name or party.company or '').strip()
    email = (party.email or '').strip() or None
    return {
        'id': party.id,
        'name': name or 'Unnamed Customer',
        'company': party.company,
        'email': email,
    }


def _serialize_invoice(invoice: Optional[Invoice]) -> Optional[Dict[str, Any]]:
    """Serialize an invoice for the API response."""
    if not invoice:
        return None
    customer_name = None
    if getattr(invoice, 'customer', None):
        customer = invoice.customer
        customer_name = (customer.name or customer.company or '').strip() or None
    return {
        'id': invoice.id,
        'invoiceNumber': invoice.invoice_number,
        'status': invoice.status,
        'total': invoice.total,
        'customerName': customer_name,
    }


def _serialize_payment(payment: Payment) -> Dict[str, Any]:
    """Serialize a payment record for API responses."""
    return {
        'id': payment.id,
        'amount': payment.amount,
        'date': payment.date,
        'paymentMethod': payment.payment_method,
        'referenceNumber': payment.reference_number,
        'notes': payment.notes,
        'status': payment.status,
        'invoiceId': payment.invoice_id,
        'vendorId': payment.vendor_id,
        'customerId': payment.customer_id,
        'createdAt': payment.created_at,
        'updatedAt': payment.updated_at,
        'invoice': _serialize_invoice(payment.invoice),
        'vendor': _serialize_party(payment.vendor, 'vendor'),
        'customer': _serialize_party(payment.customer, 'customer'),
    }


def _parse_payload(data: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize payload data for validation and persistence."""
    payload: Dict[str, Any] = {}

    try:
        payload['amount'] = float(data.get('amount') or 0)
    except (TypeError, ValueError):
        payload['amount'] = 0.0

    payload['date'] = (data.get('date') or '').strip()
    payload['payment_method'] = (data.get('paymentMethod') or '').strip() or None
    payload['reference_number'] = (data.get('referenceNumber') or '').strip() or None
    payload['notes'] = (data.get('notes') or '').strip() or None
    payload['status'] = (data.get('status') or '').strip() or None

    invoice_id = data.get('invoiceId')
    try:
        payload['invoice_id'] = int(invoice_id) if invoice_id not in (None, '', 'null') else None
    except (TypeError, ValueError):
        payload['invoice_id'] = None

    vendor_id = data.get('vendorId')
    try:
        payload['vendor_id'] = int(vendor_id) if vendor_id not in (None, '', 'null') else None
    except (TypeError, ValueError):
        payload['vendor_id'] = None

    customer_id = data.get('customerId')
    try:
        payload['customer_id'] = int(customer_id) if customer_id not in (None, '', 'null') else None
    except (TypeError, ValueError):
        payload['customer_id'] = None

    return payload


def _apply_payload(payment: Payment, payload: Dict[str, Any]) -> None:
    """Apply normalized payload data to a payment instance."""
    payment.amount = payload['amount']
    payment.date = payload['date']
    payment.payment_method = payload['payment_method']
    payment.reference_number = payload['reference_number']
    payment.notes = payload['notes']
    payment.status = payload['status']
    payment.invoice_id = payload['invoice_id']
    payment.vendor_id = payload['vendor_id']
    payment.customer_id = payload['customer_id']


@payments_bp.get('/api/payments')
def list_payments():
    """Return all payments."""
    db = SessionLocal()
    try:
        payments = db.query(Payment).all()
        return jsonify([_serialize_payment(payment) for payment in payments]), 200
    except SQLAlchemyError as exc:
        return jsonify({'error': 'Failed to load payments', 'details': str(exc)}), 500


@payments_bp.get('/api/payments/<int:payment_id>')
def get_payment(payment_id: int):
    """Return a single payment."""
    db = SessionLocal()
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404
    return jsonify(_serialize_payment(payment)), 200


@payments_bp.post('/api/payments')
def create_payment():
    """Create a new payment."""
    db = SessionLocal()
    data = request.get_json(force=True) or {}

    payload = _parse_payload(data)

    if data.get('amount') in (None, '') or not data.get('date'):
        return jsonify({'error': 'Amount and date are required'}), 400

    payment = Payment()

    if payload['amount'] <= 0:
        return jsonify({'error': 'Amount must be greater than zero'}), 400
    if not payload['date']:
        return jsonify({'error': 'Payment date is required'}), 400

    invoice = None
    if payload['invoice_id']:
        invoice = db.query(Invoice).filter(Invoice.id == payload['invoice_id']).first()
        if not invoice:
            return jsonify({'error': 'Invoice not found'}), 400

    vendor = None
    if payload['vendor_id']:
        vendor = db.query(Vendor).filter(Vendor.id == payload['vendor_id']).first()
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 400

    customer = None
    if payload['customer_id']:
        customer = db.query(Customer).filter(Customer.id == payload['customer_id']).first()
        if not customer:
            return jsonify({'error': 'Customer not found'}), 400

    if not payload['status']:
        payload['status'] = 'completed'

    _apply_payload(payment, payload)

    payment.invoice = invoice
    payment.vendor = vendor
    payment.customer = customer

    now = datetime.datetime.utcnow().isoformat()
    payment.created_at = now
    payment.updated_at = now

    db.add(payment)
    db.commit()
    db.refresh(payment)
    return jsonify(_serialize_payment(payment)), 201


@payments_bp.put('/api/payments/<int:payment_id>')
def update_payment(payment_id: int):
    """Update an existing payment."""
    db = SessionLocal()
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404

    data = request.get_json(force=True) or {}
    payload = _parse_payload(data)

    if payload['amount'] <= 0:
        return jsonify({'error': 'Amount must be greater than zero'}), 400
    if not payload['date']:
        return jsonify({'error': 'Payment date is required'}), 400

    invoice = None
    if payload['invoice_id']:
        invoice = db.query(Invoice).filter(Invoice.id == payload['invoice_id']).first()
        if not invoice:
            db.rollback()
            return jsonify({'error': 'Invoice not found'}), 400

    vendor = None
    if payload['vendor_id']:
        vendor = db.query(Vendor).filter(Vendor.id == payload['vendor_id']).first()
        if not vendor:
            db.rollback()
            return jsonify({'error': 'Vendor not found'}), 400

    customer = None
    if payload['customer_id']:
        customer = db.query(Customer).filter(Customer.id == payload['customer_id']).first()
        if not customer:
            db.rollback()
            return jsonify({'error': 'Customer not found'}), 400

    if not payload['status']:
        payload['status'] = 'completed'

    _apply_payload(payment, payload)

    payment.invoice = invoice
    payment.vendor = vendor
    payment.customer = customer

    payment.updated_at = datetime.datetime.utcnow().isoformat()

    db.commit()
    db.refresh(payment)
    return jsonify(_serialize_payment(payment)), 200


@payments_bp.delete('/api/payments/<int:payment_id>')
def delete_payment(payment_id: int):
    """Delete a payment."""
    db = SessionLocal()
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404

    db.delete(payment)
    db.commit()
    return jsonify({'status': 'ok'}), 200
