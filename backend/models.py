from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
default_sqlite_path = os.path.join(BASE_DIR, 'ledgerflow.db')
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{default_sqlite_path}")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=False))
Base = declarative_base()

# Export for use in other modules
__all__ = ['Base', 'SessionLocal', 'engine', 'DATABASE_URL', 'Company', 'TaxSettings', 'NotificationSettings', 'SecuritySettings']


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


class NotificationSettings(Base):
    __tablename__ = 'notification_settings'
    id = Column(Integer, primary_key=True, index=True)
    
    # Email notifications
    enable_email = Column(Boolean, default=False)
    email_address = Column(String(255), nullable=True)
    
    # SMS notifications
    enable_sms = Column(Boolean, default=False)
    phone_number = Column(String(50), nullable=True)


class SecuritySettings(Base):
    __tablename__ = 'security_settings'
    id = Column(Integer, primary_key=True, index=True)
    
    # Password (hashed)
    password_hash = Column(String(255), nullable=True)
    
    # Two-factor authentication
    enable2fa = Column(Boolean, default=False)
    two_factor_method = Column(String(10), default='email')  # 'email' or 'sms'