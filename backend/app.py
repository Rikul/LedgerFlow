from flask import Flask, jsonify, request
import jwt
import datetime
from flask_cors import CORS
from flask_migrate import Migrate
import bcrypt
from models import Base, SessionLocal, engine, Company, TaxSettings, NotificationSettings, SecuritySettings, Customer, DATABASE_URL


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
        settings = db.query(SecuritySettings).first()
        if not settings:
            return jsonify(None), 200
        return jsonify({
            'enable2fa': settings.enable2fa,
            'twoFactorMethod': settings.two_factor_method,
            'hasPassword': bool(settings.password_hash)
        }), 200

    @app.post('/api/security/settings')
    def update_security_settings():
        db = SessionLocal()
        data = request.get_json(force=True) or {}
        settings = db.query(SecuritySettings).first()
        if not settings:
            settings = SecuritySettings()
            db.add(settings)
        settings.enable2fa = data.get('enable2fa', False)
        settings.two_factor_method = data.get('twoFactorMethod', 'email')
        db.commit()
        return jsonify({ 'status': 'ok', 'id': settings.id }), 200

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
