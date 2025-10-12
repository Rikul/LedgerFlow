"""Pytest fixtures and configuration for backend tests."""
import os
import sys
import tempfile
import pytest

# Add backend directory to path to allow imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture(scope='function')
def app():
    """Create and configure a test Flask application instance."""
    # Create a temporary database file
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    test_db_url = f'sqlite:///{db_path}'
    
    # Set environment variable before importing anything
    original_db_url = os.environ.get('DATABASE_URL')
    os.environ['DATABASE_URL'] = test_db_url
    
    # Clear any cached imports to force reload with test DB
    import importlib
    for module in list(sys.modules.keys()):
        if module.startswith(('models', 'database', 'app', 'routes')):
            if module in sys.modules:
                del sys.modules[module]
    
    # Now import with test database URL
    from database import Base, SessionLocal, engine
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Import and create app
    from app import create_app
    app = create_app()
    app.config['TESTING'] = True
    
    yield app
    
    # Cleanup
    SessionLocal.remove()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    
    # Restore original DATABASE_URL
    if original_db_url:
        os.environ['DATABASE_URL'] = original_db_url
    else:
        os.environ.pop('DATABASE_URL', None)
    
    os.close(db_fd)
    if os.path.exists(db_path):
        os.unlink(db_path)


@pytest.fixture
def client(app):
    """Create a test client for the Flask application."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Create a test CLI runner for the Flask application."""
    return app.test_cli_runner()
