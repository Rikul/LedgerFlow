"""Company model."""
from sqlalchemy import Column, Integer, String
from database import Base


class Company(Base):
    """Company information model."""
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
