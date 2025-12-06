"""Settings routes (tax, notification, security)."""
import datetime
import jwt
import bcrypt
from flask import Blueprint, jsonify, request, current_app
from models import SessionLocal, TaxSettings, NotificationSettings, SecuritySettings, Company

settings_bp = Blueprint('settings', __name__)


def get_jwt_secret():
    """Get JWT secret key from app config."""
    return current_app.config.get('JWT_SECRET_KEY')


# Tax Settings Routes
@settings_bp.get('/api/tax-settings')
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


@settings_bp.post('/api/tax-settings')
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
@settings_bp.get('/api/notification-settings')
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


@settings_bp.post('/api/notification-settings')
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
@settings_bp.get('/api/security/settings')
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


@settings_bp.post('/api/security/settings')
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


@settings_bp.post('/api/security/change-password')
def change_password():
    db = SessionLocal()
    data = request.get_json(force=True) or {}
    current_password = data.get('currentPassword', '')
    new_password = data.get('newPassword', '')
    if not current_password or not new_password:
        return jsonify({ 'error': 'Current password and new password are required' }), 400
    if len(new_password) < 8:
        return jsonify({ 'error': 'Password must be at least 8 characters long' }), 400
    settings = db.query(SecuritySettings).first()
    if not settings:
        settings = SecuritySettings()
        db.add(settings)
    # If there's an existing password, verify current password
    if settings.password_hash:
        if not bcrypt.checkpw(current_password.encode('utf-8'), settings.password_hash.encode('utf-8')):
            return jsonify({ 'error': 'Current password is incorrect' }), 400
    # Hash new password with higher work factor
    salt = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt)
    settings.password_hash = hashed_password.decode('utf-8')
    db.commit()
    return jsonify({ 'status': 'ok', 'message': 'Password updated successfully' }), 200


@settings_bp.post('/api/security/login')
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
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Reduced from 8 to 1 hour
    }
    token = jwt.encode(payload, get_jwt_secret(), algorithm='HS256')
    return jsonify({ 'token': token }), 200


@settings_bp.post('/api/security/set-password')
def set_initial_password():
    db = SessionLocal()
    data = request.get_json(force=True) or {}
    password = data.get('password', '')
    if not password:
        return jsonify({ 'error': 'Password required' }), 400
    if len(password) < 8:
        return jsonify({ 'error': 'Password must be at least 8 characters long' }), 400
    settings = db.query(SecuritySettings).first()
    if not settings:
        settings = SecuritySettings()
        db.add(settings)
    if settings.password_hash:
        return jsonify({ 'error': 'Password already set' }), 400
    salt = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    settings.password_hash = hashed_password.decode('utf-8')
    db.commit()
    return jsonify({ 'status': 'ok' }), 200


@settings_bp.post('/api/security/verify-token')
def verify_token():
    data = request.get_json(force=True) or {}
    token = data.get('token', '')
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=['HS256'])
        return jsonify({ 'valid': True, 'user': payload.get('user') }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({ 'valid': False, 'error': 'Token expired' }), 401
    except jwt.InvalidTokenError:
        return jsonify({ 'valid': False, 'error': 'Invalid token' }), 401


@settings_bp.post('/api/setup')
def initial_setup():
    db = SessionLocal()
    try:
        data = request.get_json(force=True) or {}
        password = data.get('password', '')
        company_data = data.get('company', {})
        company_name = company_data.get('name', '')

        if not password or not company_name:
            return jsonify({ 'error': 'Password and company name are required' }), 400
        
        if len(password) < 8:
            return jsonify({ 'error': 'Password must be at least 8 characters long' }), 400

        # Set password
        settings = db.query(SecuritySettings).first()
        if not settings:
            settings = SecuritySettings()
            db.add(settings)
        if settings.password_hash:
            return jsonify({ 'error': 'Password already set' }), 400
        salt = bcrypt.gensalt(rounds=12)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        settings.password_hash = hashed_password.decode('utf-8')

        # Create company
        company = db.query(Company).first()
        if not company:
            company = Company()
            db.add(company)

        company.name = company_name
        company.contact_email = company_data.get('contactEmail')
        company.company_phone = company_data.get('companyPhone')

        mailing = company_data.get('mailing', {})
        company.mailing_address1 = mailing.get('address1')
        company.mailing_address2 = mailing.get('address2')
        company.mailing_city = mailing.get('city')
        company.mailing_state = mailing.get('state')
        company.mailing_postal_code = mailing.get('postalCode')
        company.mailing_country = mailing.get('country')

        db.commit()
        return jsonify({ 'status': 'ok' }), 200
    finally:
        db.close()
