"""Expense routes."""
import datetime
from typing import Any, Dict, Optional

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from models import SessionLocal, Expense, Vendor, Customer

expenses_bp = Blueprint('expenses', __name__)


def _serialize_party(party: Any, party_type: str) -> Optional[Dict[str, Any]]:
    """Serialize a vendor or customer for API responses."""
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


def _serialize_expense(expense: Expense) -> Dict[str, Any]:
    """Serialize an expense record for API responses."""
    return {
        'id': expense.id,
        'type': expense.type,
        'amount': expense.amount,
        'date': expense.date,
        'paymentMethod': expense.payment_method,
        'referenceNumber': expense.reference_number,
        'description': expense.description,
        'taxDeductible': bool(expense.tax_deductible),
        'tag': expense.tag,
        'vendorId': expense.vendor_id,
        'customerId': expense.customer_id,
        'createdAt': expense.created_at,
        'updatedAt': expense.updated_at,
        'vendor': _serialize_party(expense.vendor, 'vendor'),
        'customer': _serialize_party(expense.customer, 'customer'),
    }


def _apply_payload(expense: Expense, data: Dict[str, Any]) -> None:
    """Apply request payload data to an expense instance."""
    expense.type = (data.get('type') or '').strip()
    expense.amount = float(data.get('amount') or 0)
    expense.date = (data.get('date') or '').strip()
    expense.payment_method = (data.get('paymentMethod') or '').strip() or None
    expense.reference_number = (data.get('referenceNumber') or '').strip() or None
    expense.description = (data.get('description') or '').strip() or None
    expense.tax_deductible = bool(data.get('taxDeductible'))
    expense.tag = (data.get('tag') or '').strip() or None

    vendor_id = data.get('vendorId')
    try:
        expense.vendor_id = int(vendor_id) if vendor_id not in (None, '', 'null') else None
    except (TypeError, ValueError):
        expense.vendor_id = None

    customer_id = data.get('customerId')
    try:
        expense.customer_id = int(customer_id) if customer_id not in (None, '', 'null') else None
    except (TypeError, ValueError):
        expense.customer_id = None


@expenses_bp.get('/api/expenses')
def list_expenses():
    """Return all expenses."""
    db = SessionLocal()
    try:
        expenses = db.query(Expense).all()
        return jsonify([_serialize_expense(expense) for expense in expenses]), 200
    except SQLAlchemyError as exc:
        return jsonify({'error': 'Failed to load expenses', 'details': str(exc)}), 500


@expenses_bp.get('/api/expenses/<int:expense_id>')
def get_expense(expense_id: int):
    """Return a single expense."""
    db = SessionLocal()
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    return jsonify(_serialize_expense(expense)), 200


@expenses_bp.post('/api/expenses')
def create_expense():
    """Create a new expense."""
    db = SessionLocal()
    data = request.get_json(force=True) or {}

    if not data.get('type') or data.get('amount') in (None, '') or not data.get('date'):
        return jsonify({'error': 'Type, amount and date are required'}), 400

    expense = Expense()
    _apply_payload(expense, data)

    if not expense.type:
        return jsonify({'error': 'Expense type is required'}), 400
    if expense.amount <= 0:
        return jsonify({'error': 'Amount must be greater than zero'}), 400

    if expense.vendor_id:
        vendor = db.query(Vendor).filter(Vendor.id == expense.vendor_id).first()
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 400
        expense.vendor = vendor

    if expense.customer_id:
        customer = db.query(Customer).filter(Customer.id == expense.customer_id).first()
        if not customer:
            return jsonify({'error': 'Customer not found'}), 400
        expense.customer = customer

    now = datetime.datetime.utcnow().isoformat()
    expense.created_at = now
    expense.updated_at = now

    db.add(expense)
    db.commit()
    db.refresh(expense)
    return jsonify(_serialize_expense(expense)), 201


@expenses_bp.put('/api/expenses/<int:expense_id>')
def update_expense(expense_id: int):
    """Update an existing expense."""
    db = SessionLocal()
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404

    data = request.get_json(force=True) or {}
    _apply_payload(expense, data)

    if not expense.type:
        return jsonify({'error': 'Expense type is required'}), 400
    if expense.amount <= 0:
        return jsonify({'error': 'Amount must be greater than zero'}), 400

    if expense.vendor_id:
        vendor = db.query(Vendor).filter(Vendor.id == expense.vendor_id).first()
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 400
        expense.vendor = vendor
    else:
        expense.vendor = None

    if expense.customer_id:
        customer = db.query(Customer).filter(Customer.id == expense.customer_id).first()
        if not customer:
            return jsonify({'error': 'Customer not found'}), 400
        expense.customer = customer
    else:
        expense.customer = None

    expense.updated_at = datetime.datetime.utcnow().isoformat()

    db.commit()
    db.refresh(expense)
    return jsonify(_serialize_expense(expense)), 200


@expenses_bp.delete('/api/expenses/<int:expense_id>')
def delete_expense(expense_id: int):
    """Delete an expense."""
    db = SessionLocal()
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404

    db.delete(expense)
    db.commit()
    return jsonify({'status': 'ok'}), 200
