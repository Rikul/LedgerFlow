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
    CORS(app)

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

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=app.config['PORT'], debug=app.config['DEBUG'])
