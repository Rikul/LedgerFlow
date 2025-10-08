from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
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


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Create tables
    Base.metadata.create_all(bind=engine)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        SessionLocal.remove()

    # Routes
    @app.get('/api/company')
    def get_company():
        db = SessionLocal()
        company = db.query(Company).first()
        if not company:
            return jsonify(None), 200
        return jsonify({
            'id': company.id,
            'name': company.name,
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

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
