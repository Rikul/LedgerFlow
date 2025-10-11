"""Health check routes."""
import datetime
from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)


@health_bp.get('/api/health')
def health_check():
    """Simple health check endpoint to verify backend connectivity"""
    return jsonify({
        'status': 'healthy',
        'service': 'LedgerFlow Backend',
        'timestamp': datetime.datetime.utcnow().isoformat()
    }), 200
