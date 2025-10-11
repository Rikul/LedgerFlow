"""Company routes."""
from flask import Blueprint, jsonify, request
from models import SessionLocal, Company

company_bp = Blueprint('company', __name__)


@company_bp.get('/api/company')
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


@company_bp.post('/api/company')
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
