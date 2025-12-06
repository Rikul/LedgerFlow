import os

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    DEBUG = False
    TESTING = False
    PORT = int(os.environ.get('PORT', 5000))
    
    @classmethod
    def validate(cls):
        """Validate required configuration."""
        if not cls.SECRET_KEY:
            raise ValueError("SECRET_KEY environment variable must be set")
        if not cls.JWT_SECRET_KEY:
            raise ValueError("JWT_SECRET_KEY environment variable must be set")

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    
    # For development only, provide defaults if not set
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev-jwt-secret-change-in-production')
    
    @classmethod
    def validate(cls):
        """Skip validation in development."""
        pass

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SECRET_KEY = 'test-secret-key'
    JWT_SECRET_KEY = 'test-jwt-secret-key'
    
    @classmethod
    def validate(cls):
        """Skip validation in testing."""
        pass

class ProductionConfig(Config):
    """Production configuration."""
    pass

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
