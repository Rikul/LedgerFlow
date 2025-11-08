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
)


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    CORS(app)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        """Clean up database session after each request."""
        SessionLocal.remove()

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
