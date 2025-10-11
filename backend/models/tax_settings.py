"""Tax settings model."""
from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base


class TaxSettings(Base):
    """Tax configuration and rates model."""
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
