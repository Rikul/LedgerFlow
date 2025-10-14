"""Invoice CRUD routes."""
import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError
from models import SessionLocal, Invoice, InvoiceItem
from utils import parse_float, normalize_status, serialize_invoice

invoices_bp = Blueprint('invoices', __name__)


@invoices_bp.get('/api/invoices')
def get_invoices():
    db = SessionLocal()
    invoices = (
        db.query(Invoice)
        .options(joinedload(Invoice.customer), joinedload(Invoice.items))
        .order_by(Invoice.id.desc())
        .all()
    )
    return jsonify([serialize_invoice(invoice) for invoice in invoices]), 200


@invoices_bp.get('/api/invoices/<int:invoice_id>')
def get_invoice(invoice_id):
    db = SessionLocal()
    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.customer), joinedload(Invoice.items))
        .filter(Invoice.id == invoice_id)
        .first()
    )
    if not invoice:
        return jsonify({'error': 'Invoice not found'}), 404
    return jsonify(serialize_invoice(invoice)), 200


@invoices_bp.post('/api/invoices')
def create_invoice():
    db = SessionLocal()
    data = request.get_json(force=True) or {}
    invoice_number = (data.get('invoiceNumber') or '').strip()
    customer_id = data.get('customerId')
    try:
        customer_id = int(customer_id)
    except (TypeError, ValueError):
        customer_id = None

    if not invoice_number or not customer_id:
        return jsonify({'error': 'Invoice number and customer are required'}), 400

    line_items = data.get('lineItems') or []
    parsed_items = []
    subtotal = 0.0

    for item in line_items:
        description = (item.get('description') or '').strip()
        if not description:
            continue
        quantity = parse_float(item.get('quantity'), 0.0)
        rate = parse_float(item.get('rate'), 0.0)
        amount = quantity * rate
        subtotal += amount
        parsed_items.append({
            'description': description,
            'quantity': quantity,
            'rate': rate,
        })

    tax_rate = parse_float(data.get('taxRate'), 0.0)
    tax_total = subtotal * (tax_rate / 100.0)
    discount_total = parse_float(data.get('discountTotal'), 0.0)
    total = subtotal + tax_total - discount_total
    now = datetime.datetime.utcnow().isoformat()

    invoice = Invoice(
        invoice_number=invoice_number,
        customer_id=customer_id,
        status=normalize_status(data.get('status')),
        issue_date=data.get('issueDate'),
        due_date=data.get('dueDate'),
        payment_terms=data.get('paymentTerms'),
        notes=data.get('notes'),
        terms=data.get('terms'),
        tax_rate=tax_rate,
        subtotal=subtotal,
        tax_total=tax_total,
        discount_total=discount_total,
        total=total,
        created_at=now,
        updated_at=now,
    )

    db.add(invoice)

    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        return jsonify({'error': 'Invoice number must be unique'}), 400

    for item in parsed_items:
        db.add(InvoiceItem(
            invoice_id=invoice.id,
            description=item['description'],
            quantity=item['quantity'],
            rate=item['rate'],
        ))

    db.commit()

    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.customer), joinedload(Invoice.items))
        .filter(Invoice.id == invoice.id)
        .first()
    )
    return jsonify(serialize_invoice(invoice)), 201


@invoices_bp.put('/api/invoices/<int:invoice_id>')
def update_invoice(invoice_id):
    db = SessionLocal()
    data = request.get_json(force=True) or {}
    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.items), joinedload(Invoice.customer))
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        return jsonify({'error': 'Invoice not found'}), 404

    invoice_number = (data.get('invoiceNumber') or '').strip()
    customer_id = data.get('customerId')
    try:
        customer_id = int(customer_id)
    except (TypeError, ValueError):
        customer_id = None

    if not invoice_number or not customer_id:
        return jsonify({'error': 'Invoice number and customer are required'}), 400

    line_items = data.get('lineItems') or []
    parsed_items = []
    subtotal = 0.0

    for item in line_items:
        description = (item.get('description') or '').strip()
        if not description:
            continue
        quantity = parse_float(item.get('quantity'), 0.0)
        rate = parse_float(item.get('rate'), 0.0)
        amount = quantity * rate
        subtotal += amount
        parsed_items.append({
            'description': description,
            'quantity': quantity,
            'rate': rate,
        })

    tax_rate = parse_float(data.get('taxRate'), 0.0)
    tax_total = subtotal * (tax_rate / 100.0)
    discount_total = parse_float(data.get('discountTotal'), 0.0)
    total = subtotal + tax_total - discount_total

    invoice.invoice_number = invoice_number
    invoice.customer_id = customer_id
    invoice.status = normalize_status(data.get('status'))
    invoice.issue_date = data.get('issueDate')
    invoice.due_date = data.get('dueDate')
    invoice.payment_terms = data.get('paymentTerms')
    invoice.notes = data.get('notes')
    invoice.terms = data.get('terms')
    invoice.tax_rate = tax_rate
    invoice.subtotal = subtotal
    invoice.tax_total = tax_total
    invoice.discount_total = discount_total
    invoice.total = total
    invoice.updated_at = datetime.datetime.utcnow().isoformat()

    db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice.id).delete()

    for item in parsed_items:
        db.add(InvoiceItem(
            invoice_id=invoice.id,
            description=item['description'],
            quantity=item['quantity'],
            rate=item['rate'],
        ))

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return jsonify({'error': 'Invoice number must be unique'}), 400

    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.customer), joinedload(Invoice.items))
        .filter(Invoice.id == invoice.id)
        .first()
    )
    return jsonify(serialize_invoice(invoice)), 200


@invoices_bp.delete('/api/invoices/<int:invoice_id>')
def delete_invoice(invoice_id):
    db = SessionLocal()
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        return jsonify({'error': 'Invoice not found'}), 404
    db.delete(invoice)
    db.commit()
    return jsonify({'status': 'ok'}), 200
