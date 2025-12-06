from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import Base, SessionLocal, engine, DATABASE_URL, database_manager
from routes import (
    health_bp,
    customers_bp,
    vendors_bp,
    invoices_bp,
    expenses_bp,
    payments_bp,
    company_bp,
    settings_bp,
    dashboard_bp,
)


import os
from config import config

def create_app(config_name=None):
    """Create and configure the Flask application."""
    if config_name is None:
        config_name = os.environ.get('FLASK_CONFIG', 'default')

    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Configure CORS with specific origins for security
    allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:4200,http://localhost:8000').split(',')
    CORS(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Initialize migrations (variable not used but needed for Flask-Migrate)
    Migrate(app, database_manager)
    database_manager.create_all()

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(customers_bp)
    app.register_blueprint(vendors_bp)
    app.register_blueprint(invoices_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(company_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(dashboard_bp)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        """Clean up database session after each request."""
        SessionLocal.remove()
    
    @app.after_request
    def set_security_headers(response):
        """Add security headers to all responses."""
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
        return response

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=app.config['PORT'], debug=app.config['DEBUG'])
