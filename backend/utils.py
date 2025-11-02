"""Utility functions for the LedgerFlow backend."""


def parse_float(value, default=0.0):
    """Parse a value to float with a default fallback."""
    try:
        if value in (None, ''):
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def normalize_status(value, allowed_statuses=None):
    """Normalize and validate invoice status."""
    if allowed_statuses is None:
        allowed_statuses = {'draft', 'sent', 'paid'}
    value = (value or 'draft').lower()

    # Legacy invoices may still send the deprecated ``overdue`` status. Map it to
    # ``sent`` so that the application stops persisting the old value.
    if value == 'overdue':
        value = 'sent'

    if value not in allowed_statuses:
        return 'draft'
    return value


def serialize_invoice(invoice, include_items=True):
    """Serialize an invoice object to dictionary."""
    customer = None
    if invoice.customer:
        customer = {
            'id': invoice.customer.id,
            'name': invoice.customer.name,
            'email': invoice.customer.email,
            'company': invoice.customer.company,
        }

    data = {
        'id': invoice.id,
        'invoiceNumber': invoice.invoice_number,
        'customerId': invoice.customer_id,
        'status': invoice.status,
        'issueDate': invoice.issue_date,
        'dueDate': invoice.due_date,
        'paymentTerms': invoice.payment_terms,
        'notes': invoice.notes,
        'terms': invoice.terms,
        'taxRate': invoice.tax_rate or 0.0,
        'subtotal': invoice.subtotal or 0.0,
        'taxTotal': invoice.tax_total or 0.0,
        'discountTotal': invoice.discount_total or 0.0,
        'total': invoice.total or 0.0,
        'createdAt': invoice.created_at,
        'updatedAt': invoice.updated_at,
        'customer': customer,
    }

    if include_items:
        data['lineItems'] = [
            {
                'id': item.id,
                'description': item.description,
                'quantity': item.quantity,
                'rate': item.rate,
            }
            for item in invoice.items
        ]

    return data
