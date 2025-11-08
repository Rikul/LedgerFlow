"""Seed script to populate database with fake data using Faker."""
import random
from datetime import datetime, timedelta
from faker import Faker
from database import SessionLocal, engine, Base
from models import Customer, Vendor, Invoice, InvoiceItem, Expense, Payment

# Initialize Faker
fake = Faker()

# Categories for expenses
EXPENSE_TYPES = [
    'office_supplies', 'utilities', 'rent', 'software', 'hardware',
    'travel', 'meals', 'marketing', 'professional_services', 'insurance',
    'legal', 'accounting', 'training', 'maintenance', 'other'
]

PAYMENT_METHODS = ['cash', 'check', 'credit_card', 'debit_card', 'bank_transfer', 'paypal']
PAYMENT_TERMS = ['net15', 'net30', 'net45', 'net60', 'due_on_receipt']
INVOICE_STATUSES = ['draft', 'sent', 'paid']
VENDOR_CATEGORIES = ['supplier', 'contractor', 'consultant', 'utility', 'other']

# Service/product descriptions for invoice items
SERVICES = [
    'Web Development Services', 'Consulting Services', 'Design Services',
    'Marketing Campaign', 'Software License', 'Cloud Hosting',
    'Database Management', 'API Development', 'Mobile App Development',
    'SEO Optimization', 'Content Writing', 'Video Production',
    'Graphic Design', 'UI/UX Design', 'Project Management',
    'Technical Support', 'Data Analysis', 'Security Audit'
]


def create_customers(session, count=20):
    """Create fake customer records."""
    print(f"Creating {count} customers...")
    customers = []

    for i in range(count):
        # Randomly decide if billing address is same as main address
        same_billing = random.choice([True, False])

        street = fake.street_address()
        city = fake.city()
        state = fake.state()
        zip_code = fake.zipcode()
        country = fake.country()

        customer = Customer(
            name=fake.name(),
            email=fake.company_email(),
            phone=fake.phone_number(),
            company=fake.company(),
            street=street,
            city=city,
            state=state,
            zip_code=zip_code,
            country=country,
            billing_street=street if same_billing else fake.street_address(),
            billing_city=city if same_billing else fake.city(),
            billing_state=state if same_billing else fake.state(),
            billing_zip_code=zip_code if same_billing else fake.zipcode(),
            billing_country=country if same_billing else fake.country(),
            tax_id=fake.bothify(text='##-#######'),
            payment_terms=random.choice(PAYMENT_TERMS),
            credit_limit=round(random.uniform(5000, 100000), 2),
            notes=fake.sentence() if random.random() > 0.5 else None,
            is_active=random.choice([True, True, True, False]),  # 75% active
            created_at=datetime.now().isoformat()
        )
        customers.append(customer)

    session.add_all(customers)
    session.commit()
    print(f"Created {count} customers")
    return customers


def create_vendors(session, count=20):
    """Create fake vendor records."""
    print(f"Creating {count} vendors...")
    vendors = []

    for i in range(count):
        vendor = Vendor(
            contact_name=fake.name(),
            email=fake.company_email(),
            phone=fake.phone_number(),
            company=fake.company(),
            street=fake.street_address(),
            city=fake.city(),
            state=fake.state(),
            zip_code=fake.zipcode(),
            country=fake.country(),
            tax_id=fake.bothify(text='##-#######'),
            payment_terms=random.choice(PAYMENT_TERMS),
            category=random.choice(VENDOR_CATEGORIES),
            account_number=fake.bothify(text='ACC-########'),
            notes=fake.sentence() if random.random() > 0.5 else None,
            is_active=random.choice([True, True, True, False]),  # 75% active
            created_at=datetime.now().isoformat()
        )
        vendors.append(vendor)

    session.add_all(vendors)
    session.commit()
    print(f"Created {count} vendors")
    return vendors


def create_invoices(session, customers, count=50):
    """Create fake invoice records with invoice items."""
    print(f"Creating {count} invoices...")
    invoices = []

    for i in range(count):
        # Random dates within the last year
        issue_date = fake.date_between(start_date='-1y', end_date='today')
        due_date = issue_date + timedelta(days=random.choice([15, 30, 45, 60]))

        # Generate invoice number
        invoice_number = f"INV-{fake.unique.bothify(text='####-####')}"

        # Select random customer
        customer = random.choice(customers)

        # Randomly generate 1-5 invoice items
        num_items = random.randint(1, 5)
        items = []
        subtotal = 0.0

        for j in range(num_items):
            quantity = round(random.uniform(1, 20), 2)
            rate = round(random.uniform(50, 500), 2)
            amount = round(quantity * rate, 2)
            subtotal += amount

            item = InvoiceItem(
                description=random.choice(SERVICES),
                quantity=quantity,
                rate=rate
            )
            items.append(item)

        # Calculate totals
        tax_rate = random.choice([0.0, 5.0, 7.5, 10.0, 13.0])
        discount_total = round(subtotal * random.choice([0.0, 0.0, 0.0, 0.05, 0.1]), 2)
        subtotal_after_discount = subtotal - discount_total
        tax_total = round(subtotal_after_discount * (tax_rate / 100), 2)
        total = round(subtotal_after_discount + tax_total, 2)

        invoice = Invoice(
            invoice_number=invoice_number,
            customer_id=customer.id,
            status=random.choice(INVOICE_STATUSES),
            issue_date=issue_date.isoformat(),
            due_date=due_date.isoformat(),
            payment_terms=customer.payment_terms,
            notes=fake.sentence() if random.random() > 0.7 else None,
            terms=fake.paragraph() if random.random() > 0.8 else None,
            tax_rate=tax_rate,
            subtotal=round(subtotal, 2),
            tax_total=tax_total,
            discount_total=discount_total,
            total=total,
            created_at=issue_date.isoformat(),
            updated_at=datetime.now().isoformat(),
            items=items
        )
        invoices.append(invoice)

    session.add_all(invoices)
    session.commit()
    print(f"Created {count} invoices")
    return invoices


def create_expenses(session, vendors, customers, count=100):
    """Create fake expense records."""
    print(f"Creating {count} expenses...")
    expenses = []

    for i in range(count):
        # Random date within the last year
        expense_date = fake.date_between(start_date='-1y', end_date='today')

        # Randomly assign to vendor (80%) or customer (10%) or none (10%)
        rand = random.random()
        vendor_id = None
        customer_id = None

        if rand < 0.8:
            vendor_id = random.choice(vendors).id
        elif rand < 0.9:
            customer_id = random.choice(customers).id

        expense = Expense(
            type=random.choice(EXPENSE_TYPES),
            amount=round(random.uniform(10, 5000), 2),
            date=expense_date.isoformat(),
            payment_method=random.choice(PAYMENT_METHODS),
            reference_number=fake.bothify(text='REF-########') if random.random() > 0.5 else None,
            description=fake.sentence(),
            tax_deductible=random.choice([True, False]),
            tag=random.choice(['business', 'office', 'travel', 'equipment', None]),
            vendor_id=vendor_id,
            customer_id=customer_id,
            created_at=expense_date.isoformat(),
            updated_at=datetime.now().isoformat()
        )
        expenses.append(expense)

    session.add_all(expenses)
    session.commit()
    print(f"Created {count} expenses")
    return expenses


def create_payments(session, invoices, vendors, customers, count=80):
    """Create fake payment records linked to invoices, vendors, and customers."""
    print(f"Creating {count} payments...")
    payments = []

    for _ in range(count):
        payment_date = fake.date_between(start_date='-1y', end_date='today')
        amount = round(random.uniform(25, 15000), 2)

        invoice = random.choice(invoices) if invoices else None
        vendor = random.choice(vendors) if vendors and random.random() < 0.6 else None
        customer = None

        if invoice and random.random() < 0.7:
            customer = next((c for c in customers if c.id == invoice.customer_id), None)
        elif customers and random.random() < 0.5:
            customer = random.choice(customers)

        payment = Payment(
            amount=amount,
            date=payment_date.isoformat(),
            payment_method=random.choice(PAYMENT_METHODS),
            reference_number=fake.bothify(text='PMT-########') if random.random() > 0.4 else None,
            notes=fake.sentence() if random.random() > 0.7 else None,
            invoice_id=invoice.id if invoice else None,
            vendor_id=vendor.id if vendor else None,
            customer_id=customer.id if customer else None,
            created_at=payment_date.isoformat(),
            updated_at=datetime.now().isoformat(),
        )
        payments.append(payment)

    session.add_all(payments)
    session.commit()
    print(f"Created {count} payments")
    return payments


def main():
    """Main seeding function."""
    print("Starting data seeding...")
    print("=" * 50)

    # Create database session
    session = SessionLocal()

    try:
        # Create all tables if they don't exist
        Base.metadata.create_all(bind=engine)

        # Seed data
        customers = create_customers(session, count=20)
        vendors = create_vendors(session, count=20)
        invoices = create_invoices(session, customers, count=50)
        expenses = create_expenses(session, vendors, customers, count=100)
        payments = create_payments(session, invoices, vendors, customers, count=80)

        print("=" * 50)
        print("Data seeding completed successfully!")
        print(f"Total created:")
        print(f"  - Customers: {len(customers)}")
        print(f"  - Vendors: {len(vendors)}")
        print(f"  - Invoices: {len(invoices)}")
        print(f"  - Expenses: {len(expenses)}")
        print(f"  - Payments: {len(payments)}")

    except Exception as e:
        print(f"Error during seeding: {e}")
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == '__main__':
    main()
