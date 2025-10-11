"""Security settings model."""
from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class SecuritySettings(Base):
    """Security and authentication settings model."""
    __tablename__ = 'security_settings'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Password (hashed)
    password_hash = Column(String(255), nullable=True)
    
    # Two-factor authentication
    enable2fa = Column(Boolean, default=False)
    two_factor_method = Column(String(10), default='email')  # 'email' or 'sms'
