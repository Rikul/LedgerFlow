"""Notification settings model."""
from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class NotificationSettings(Base):
    """Notification preferences model."""
    __tablename__ = 'notification_settings'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Email notifications
    enable_email = Column(Boolean, default=False)
    email_address = Column(String(255), nullable=True)
    
    # SMS notifications
    enable_sms = Column(Boolean, default=False)
    phone_number = Column(String(50), nullable=True)
