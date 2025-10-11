from flask import Flask, jsonify, request
import jwt
import datetime
from flask_cors import CORS
from flask_migrate import Migrate
import bcrypt
from models import (
    Base,
    SessionLocal,
    engine,
    Company,
    TaxSettings,
    NotificationSettings,
    SecuritySettings,
    Customer,
    Vendor,
    Invoice,
    InvoiceItem,
    DATABASE_URL,
)
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError


# Replace this with .env in production
# load_dotenv()  # Load from .env file
# SECRET_KEY = os.environ.get('SECRET_KEY')

SECRET_KEY = 'PPkGPmyTkmBY18J65ZYU_RQHhd-8N18ITFOiqth7Jqg'

def create_app():
    
    app = Flask(__name__)
    CORS(app)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize migrations (variable not used but needed for Flask-Migrate)
    Migrate(app, Base)
    Base.metadata.create_all(bind=engine)

    allowed_statuses = {'draft', 'sent', 'paid', 'overdue'}

    def parse_float(value, default=0.0):
        try:
            if value in (None, ''):
                return default
            return float(value)
        except (TypeError, ValueError):
            return default

    def normalize_status(value):
        value = (value or 'draft').lower()
        if value not in allowed_statuses:
            return 'draft'
        return value

    def serialize_invoice(invoice, include_items=True):
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
                    'taxRate': item.tax_rate,
                }
                for item in invoice.items
            ]

        return data

    # Health Check Endpoint
    @app.get('/api/health')
    def health_check():
        """Simple health check endpoint to verify backend connectivity"""
        return jsonify({
            'status': 'healthy',
            'service': 'LedgerFlow Backend',
            'timestamp': datetime.datetime.utcnow().isoformat()
        }), 200

    # Customer CRUD Endpoints
    @app.get('/api/customers')
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

    @app.post('/api/customers')
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

    @app.put('/api/customers/<int:customer_id>')
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

    @app.delete('/api/customers/<int:customer_id>')
    def delete_customer(customer_id):
        db = SessionLocal()
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        db.delete(customer)
        db.commit()
        return jsonify({'status': 'ok'}), 200

    # Vendor CRUD Endpoints
    @app.get('/api/vendors')
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

    @app.post('/api/vendors')
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

    @app.put('/api/vendors/<int:vendor_id>')
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

    @app.delete('/api/vendors/<int:vendor_id>')
    def delete_vendor(vendor_id):
        db = SessionLocal()
        vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        db.delete(vendor)
        db.commit()
        return jsonify({'status': 'ok'}), 200

    # Invoice CRUD Endpoints
    @app.get('/api/invoices')
    def get_invoices():
        db = SessionLocal()
        invoices = (
            db.query(Invoice)
            .options(joinedload(Invoice.customer), joinedload(Invoice.items))
            .order_by(Invoice.id.desc())
            .all()
        )
        return jsonify([serialize_invoice(invoice) for invoice in invoices]), 200

    @app.get('/api/invoices/<int:invoice_id>')
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

    @app.post('/api/invoices')
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
        tax_total = 0.0

        for item in line_items:
            description = (item.get('description') or '').strip()
            if not description:
                continue
            quantity = parse_float(item.get('quantity'), 0.0)
            rate = parse_float(item.get('rate'), 0.0)
            tax_rate = parse_float(item.get('taxRate'), 0.0)
            amount = quantity * rate
            subtotal += amount
            tax_total += amount * (tax_rate / 100.0)
            parsed_items.append({
                'description': description,
                'quantity': quantity,
                'rate': rate,
                'tax_rate': tax_rate,
            })

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
                tax_rate=item['tax_rate'],
            ))

        db.commit()

        invoice = (
            db.query(Invoice)
            .options(joinedload(Invoice.customer), joinedload(Invoice.items))
            .filter(Invoice.id == invoice.id)
            .first()
        )
        return jsonify(serialize_invoice(invoice)), 201

    @app.put('/api/invoices/<int:invoice_id>')
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
        tax_total = 0.0

        for item in line_items:
            description = (item.get('description') or '').strip()
            if not description:
                continue
            quantity = parse_float(item.get('quantity'), 0.0)
            rate = parse_float(item.get('rate'), 0.0)
            tax_rate = parse_float(item.get('taxRate'), 0.0)
            amount = quantity * rate
            subtotal += amount
            tax_total += amount * (tax_rate / 100.0)
            parsed_items.append({
                'description': description,
                'quantity': quantity,
                'rate': rate,
                'tax_rate': tax_rate,
            })

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
                tax_rate=item['tax_rate'],
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

    @app.delete('/api/invoices/<int:invoice_id>')
    def delete_invoice(invoice_id):
        db = SessionLocal()
        invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
        if not invoice:
            return jsonify({'error': 'Invoice not found'}), 404
        db.delete(invoice)
        db.commit()
        return jsonify({'status': 'ok'}), 200

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        SessionLocal.remove()

    # Company Routes
    @app.get('/api/company')
    def get_company():
        db = SessionLocal()
        company = db.query(Company).first()
        if not company:
            return jsonify(None), 200
        return jsonify({
            'id': company.id,
            'name': company.name,
            'contactEmail': company.contact_email,
            'companyPhone': company.company_phone,
            'mailing': {
                'address1': company.mailing_address1,
                'address2': company.mailing_address2,
                'city': company.mailing_city,
                'state': company.mailing_state,
                'postalCode': company.mailing_postal_code,
                'country': company.mailing_country,
            },
            'physical': {
                'address1': company.physical_address1,
                'address2': company.physical_address2,
                'city': company.physical_city,
                'state': company.physical_state,
                'postalCode': company.physical_postal_code,
                'country': company.physical_country,
            }
        }), 200

    @app.post('/api/company')
    def upsert_company():
        db = SessionLocal()
        data = request.get_json(force=True) or {}
        company = db.query(Company).first()
        if not company:
            company = Company()
            db.add(company)

        company.name = data.get('companyName') or data.get('name') or ''
        company.contact_email = data.get('contactEmail')
        company.company_phone = data.get('companyPhone')
        
        mailing = data.get('mailing') or {}
        physical = data.get('physical') or {}

        company.mailing_address1 = mailing.get('address1')
        company.mailing_address2 = mailing.get('address2')
        company.mailing_city = mailing.get('city')
        company.mailing_state = mailing.get('state')
        company.mailing_postal_code = mailing.get('postalCode')
        company.mailing_country = mailing.get('country')
        company.physical_address1 = physical.get('address1')
        company.physical_address2 = physical.get('address2')
        company.physical_city = physical.get('city')
        company.physical_state = physical.get('state')
        company.physical_postal_code = physical.get('postalCode')
        company.physical_country = physical.get('country')

        db.commit()
        return jsonify({ 'status': 'ok', 'id': company.id }), 200

    # Tax Settings Routes
    @app.get('/api/tax-settings')
    def get_tax_settings():
        db = SessionLocal()
        settings = db.query(TaxSettings).first()
        if not settings:
            return jsonify(None), 200
            
        # Convert stored data to array format for frontend
        rates = []
        for i in range(1, 6):
            name = getattr(settings, f'tax_rate_{i}_name')
            rate = getattr(settings, f'tax_rate_{i}_rate')
            compound = getattr(settings, f'tax_rate_{i}_compound')
            if name:  # Only include rates that have a name
                rates.append({
                    'name': name,
                    'rate': rate or 0,
                    'compound': compound or False
                })
        
        return jsonify({
          
            'org': {
                'entityType': settings.entity_type,
                'taxId': settings.tax_id,
                'country': settings.country,
                'region': settings.region
            },
            'defaultTaxRate': settings.default_tax_rate,
            'rates': rates
        }), 200

    @app.post('/api/tax-settings')
    def upsert_tax_settings():
        db = SessionLocal()
        data = request.get_json(force=True) or {}
        settings = db.query(TaxSettings).first()
        if not settings:
            settings = TaxSettings()
            db.add(settings)

        settings.enable_taxes = data.get('enableTaxes', True)
        settings.tax_basis = data.get('taxBasis', 'accrual')
        settings.prices_include_tax = data.get('pricesIncludeTax', False)
        settings.default_tax_rate = data.get('defaultTaxRate', 0.0)
        
        org = data.get('org') or {}
        settings.entity_type = org.get('entityType', 'llc')
        settings.tax_id = org.get('taxId')
        settings.country = org.get('country')
        settings.region = org.get('region')

        # Clear all existing rates first
        for i in range(1, 6):
            setattr(settings, f'tax_rate_{i}_name', None)
            setattr(settings, f'tax_rate_{i}_rate', None)
            setattr(settings, f'tax_rate_{i}_compound', False)

        # Set new rates (up to 5)
        rates = data.get('rates', [])
        for i, rate in enumerate(rates[:5], 1):  # Limit to 5 rates
            setattr(settings, f'tax_rate_{i}_name', rate.get('name'))
            setattr(settings, f'tax_rate_{i}_rate', rate.get('rate'))
            setattr(settings, f'tax_rate_{i}_compound', rate.get('compound', False))

        db.commit()
        return jsonify({ 'status': 'ok', 'id': settings.id }), 200

    # Notification Settings Routes
    @app.get('/api/notification-settings')
    def get_notification_settings():
        db = SessionLocal()
        settings = db.query(NotificationSettings).first()
        if not settings:
            return jsonify(None), 200
        
        return jsonify({
            'enableEmail': settings.enable_email,
            'emailAddress': settings.email_address,
            'enableSms': settings.enable_sms,
            'phoneNumber': settings.phone_number
        }), 200

    @app.post('/api/notification-settings')
    def upsert_notification_settings():
        db = SessionLocal()
        data = request.get_json(force=True) or {}
        settings = db.query(NotificationSettings).first()
        if not settings:
            settings = NotificationSettings()
            db.add(settings)

        settings.enable_email = data.get('enableEmail', False)
        settings.email_address = data.get('emailAddress')
        settings.enable_sms = data.get('enableSms', False)
        settings.phone_number = data.get('phoneNumber')

        db.commit()
        return jsonify({ 'status': 'ok', 'id': settings.id }), 200


    # Security Settings Routes
    @app.get('/api/security/settings')
    def get_security_settings():
        db = SessionLocal()
        try:
            settings = db.query(SecuritySettings).first()
            if not settings:
                return jsonify(None), 200
            return jsonify({
                'enable2fa': settings.enable2fa,
                'twoFactorMethod': settings.two_factor_method,
                'hasPassword': bool(settings.password_hash)
            }), 200
        finally:
            db.close()

    @app.post('/api/security/settings')
    def update_security_settings():
        db = SessionLocal()
        try:
            data = request.get_json(force=True) or {}
            settings = db.query(SecuritySettings).first()
            if not settings:
                settings = SecuritySettings()
                db.add(settings)
            settings.enable2fa = data.get('enable2fa', False)
            settings.two_factor_method = data.get('twoFactorMethod', 'email')
            db.commit()
            return jsonify({ 'status': 'ok', 'id': settings.id }), 200
        finally:
            db.close()

    @app.post('/api/security/change-password')
    def change_password():
        db = SessionLocal()
        data = request.get_json(force=True) or {}
        current_password = data.get('currentPassword', '')
        new_password = data.get('newPassword', '')
        if not current_password or not new_password:
            return jsonify({ 'error': 'Current password and new password are required' }), 400
        settings = db.query(SecuritySettings).first()
        if not settings:
            settings = SecuritySettings()
            db.add(settings)
        # If there's an existing password, verify current password
        if settings.password_hash:
            if not bcrypt.checkpw(current_password.encode('utf-8'), settings.password_hash.encode('utf-8')):
                return jsonify({ 'error': 'Current password is incorrect' }), 400
        # Hash new password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt)
        settings.password_hash = hashed_password.decode('utf-8')
        db.commit()
        return jsonify({ 'status': 'ok', 'message': 'Password updated successfully' }), 200

    # JWT Login Endpoint
    @app.post('/api/security/login')
    def login():
        db = SessionLocal()
        data = request.get_json(force=True) or {}
        password = data.get('password', '')
        settings = db.query(SecuritySettings).first()
        if not settings or not settings.password_hash:
            return jsonify({ 'error': 'No password set' }), 403
        if not bcrypt.checkpw(password.encode('utf-8'), settings.password_hash.encode('utf-8')):
            return jsonify({ 'error': 'Invalid password' }), 401
        payload = {
            'user': 'admin',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return jsonify({ 'token': token }), 200

    # Initial Password Setup Endpoint
    @app.post('/api/security/set-password')
    def set_initial_password():
        db = SessionLocal()
        data = request.get_json(force=True) or {}
        password = data.get('password', '')
        if not password:
            return jsonify({ 'error': 'Password required' }), 400
        settings = db.query(SecuritySettings).first()
        if not settings:
            settings = SecuritySettings()
            db.add(settings)
        if settings.password_hash:
            return jsonify({ 'error': 'Password already set' }), 400
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        settings.password_hash = hashed_password.decode('utf-8')
        db.commit()
        return jsonify({ 'status': 'ok' }), 200

    # JWT Token Verification Endpoint
    @app.post('/api/security/verify-token')
    def verify_token():
        data = request.get_json(force=True) or {}
        token = data.get('token', '')
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return jsonify({ 'valid': True, 'user': payload.get('user') }), 200
        except jwt.ExpiredSignatureError:
            return jsonify({ 'valid': False, 'error': 'Token expired' }), 401
        except jwt.InvalidTokenError:
            return jsonify({ 'valid': False, 'error': 'Invalid token' }), 401

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
