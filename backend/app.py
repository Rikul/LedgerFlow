from flask import Flask, jsonify, request
import jwt
import datetime
from flask_cors import CORS
from flask_migrate import Migrate
import bcrypt
from models import Base, SessionLocal, engine, Company, TaxSettings, NotificationSettings, SecuritySettings, DATABASE_URL


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
            'enable2fa': settings.enable_2fa,
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
        settings.enable_2fa = data.get('enable2fa', False)
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
