"""Dashboard analytics routes."""
from collections import defaultdict
from datetime import datetime, date

from flask import Blueprint, jsonify
from sqlalchemy.orm import joinedload

from models import SessionLocal, Invoice, Expense


dashboard_bp = Blueprint('dashboard', __name__)


def parse_iso_date(value):
    """Parse supported date strings to ``date`` objects."""
    if not value:
        return None

    if isinstance(value, date):
        return value

    if isinstance(value, datetime):
        return value.date()

    for fmt in (
        None,
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
    ):
        try:
            if fmt is None:
                return datetime.fromisoformat(value).date()
            return datetime.strptime(value, fmt).date()
        except (TypeError, ValueError):
            continue
    return None


def month_start(value):
    """Return the first day of the month for a date."""
    return date(value.year, value.month, 1)


def shift_month(reference, offset):
    """Shift ``reference`` month by ``offset`` months."""
    year = reference.year + (reference.month - 1 + offset) // 12
    month = (reference.month - 1 + offset) % 12 + 1
    return date(year, month, 1)


def percent_change(current, previous):
    """Calculate the percentage change between two numbers."""
    if previous == 0:
        return 0.0 if current == 0 else 100.0
    return ((current - previous) / previous) * 100.0


@dashboard_bp.get('/api/dashboard')
def get_dashboard_data():
    """Aggregate metrics for the dashboard view."""
    db = SessionLocal()
    try:
        invoices = (
            db.query(Invoice)
            .options(joinedload(Invoice.customer))
            .all()
        )
        expenses = db.query(Expense).all()

        total_revenue = sum((invoice.total or 0.0) for invoice in invoices if invoice.status == 'paid')
        total_expenses = sum((expense.amount or 0.0) for expense in expenses)

        outstanding_invoices = [invoice for invoice in invoices if invoice.status != 'paid']
        outstanding_total = sum((invoice.total or 0.0) for invoice in outstanding_invoices)
        outstanding_count = len(outstanding_invoices)

        net_profit = total_revenue - total_expenses

        today = date.today()
        current_month = date(today.year, today.month, 1)
        previous_month = shift_month(current_month, -1)

        revenue_by_month = defaultdict(float)
        expenses_by_month = defaultdict(float)

        for invoice in invoices:
            if invoice.status != 'paid':
                continue
            invoice_date = parse_iso_date(invoice.issue_date) or parse_iso_date(invoice.created_at)
            if not invoice_date:
                continue
            revenue_by_month[month_start(invoice_date)] += invoice.total or 0.0

        for expense in expenses:
            expense_date = parse_iso_date(expense.date) or parse_iso_date(expense.created_at)
            if not expense_date:
                continue
            expenses_by_month[month_start(expense_date)] += expense.amount or 0.0

        current_revenue = revenue_by_month.get(current_month, 0.0)
        previous_revenue = revenue_by_month.get(previous_month, 0.0)
        revenue_change = percent_change(current_revenue, previous_revenue)

        current_expenses = expenses_by_month.get(current_month, 0.0)
        previous_expenses = expenses_by_month.get(previous_month, 0.0)
        expenses_change = percent_change(current_expenses, previous_expenses)

        current_profit = current_revenue - current_expenses
        previous_profit = previous_revenue - previous_expenses
        profit_change = percent_change(current_profit, previous_profit)

        trend_months = [shift_month(current_month, offset) for offset in range(-5, 1)]
        revenue_trend = [
            {
                'label': month.strftime('%b %Y'),
                'total': round(revenue_by_month.get(month, 0.0), 2),
            }
            for month in trend_months
        ]

        recent_invoices = sorted(
            invoices,
            key=lambda invoice: (
                parse_iso_date(invoice.issue_date)
                or parse_iso_date(invoice.created_at)
                or date.min
            ),
            reverse=True,
        )[:5]

        recent_invoices_data = []
        for invoice in recent_invoices:
            due_date = parse_iso_date(invoice.due_date)
            recent_invoices_data.append({
                'invoiceNumber': invoice.invoice_number,
                'customerName': invoice.customer.name if invoice.customer else 'Unknown',
                'total': round(invoice.total or 0.0, 2),
                'status': invoice.status,
                'dueDate': due_date.isoformat() if due_date else None,
            })

        response = {
            'metrics': {
                'totalRevenue': {'amount': round(total_revenue, 2), 'change': round(revenue_change, 2)},
                'totalExpenses': {'amount': round(total_expenses, 2), 'change': round(expenses_change, 2)},
                'outstandingInvoices': {'amount': round(outstanding_total, 2), 'count': outstanding_count},
                'netProfit': {'amount': round(net_profit, 2), 'change': round(profit_change, 2)},
            },
            'revenueTrend': revenue_trend,
            'recentInvoices': recent_invoices_data,
        }

        return jsonify(response), 200
    finally:
        db.close()
        SessionLocal.remove()
