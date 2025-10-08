from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
from flask_migrate import Migrate
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
default_sqlite_path = os.path.join(BASE_DIR, 'ledgerflow.db')
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{default_sqlite_path}")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=False))
Base = declarative_base()


class Company(Base):
    __tablename__ = 'companies'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    mailing_address1 = Column(String(255), nullable=True)
    mailing_address2 = Column(String(255), nullable=True)
    mailing_city = Column(String(100), nullable=True)
    mailing_state = Column(String(100), nullable=True)
    mailing_postal_code = Column(String(50), nullable=True)
    mailing_country = Column(String(100), nullable=True)
    physical_address1 = Column(String(255), nullable=True)
    physical_address2 = Column(String(255), nullable=True)
    physical_city = Column(String(100), nullable=True)
    physical_state = Column(String(100), nullable=True)
    physical_postal_code = Column(String(50), nullable=True)
    physical_country = Column(String(100), nullable=True)
    contact_email = Column(String(255), nullable=True)
    company_phone = Column(String(50), nullable=True)


class TaxSettings(Base):
    __tablename__ = 'tax_settings'
    id = Column(Integer, primary_key=True, index=True)
   
    # Organization info
    entity_type = Column(String(50), default='llc')
    tax_id = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    
    # Default tax rate
    default_tax_rate = Column(Float, default=0.0)
    
    # Additional tax rates (5 slots)
    tax_rate_1_name = Column(String(100), nullable=True)
    tax_rate_1_rate = Column(Float, nullable=True)
    tax_rate_1_compound = Column(Boolean, default=False)
    
    tax_rate_2_name = Column(String(100), nullable=True)
    tax_rate_2_rate = Column(Float, nullable=True)
    tax_rate_2_compound = Column(Boolean, default=False)
    
    tax_rate_3_name = Column(String(100), nullable=True)
    tax_rate_3_rate = Column(Float, nullable=True)
    tax_rate_3_compound = Column(Boolean, default=False)
    
    tax_rate_4_name = Column(String(100), nullable=True)
    tax_rate_4_rate = Column(Float, nullable=True)
    tax_rate_4_compound = Column(Boolean, default=False)
    
    tax_rate_5_name = Column(String(100), nullable=True)
    tax_rate_5_rate = Column(Float, nullable=True)
    tax_rate_5_compound = Column(Boolean, default=False)


def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    migrate = Migrate(app, Base)
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

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
