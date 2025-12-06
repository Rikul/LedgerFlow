"""Authentication and authorization utilities."""
from functools import wraps
import jwt
import logging
from flask import request, jsonify, current_app

logger = logging.getLogger(__name__)


def get_jwt_secret():
    """Get JWT secret key from app config."""
    return current_app.config.get('JWT_SECRET_KEY')


def require_auth(f):
    """Decorator to require JWT authentication for route."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'No authorization token provided'}), 401
        
        try:
            # Extract token from "Bearer <token>" format
            parts = auth_header.split()
            if len(parts) != 2 or parts[0].lower() != 'bearer':
                return jsonify({'error': 'Invalid authorization header format'}), 401
            
            token = parts[1]
            
            # Verify token
            payload = jwt.decode(
                token,
                get_jwt_secret(),
                algorithms=['HS256']
            )
            
            # Token is valid, proceed with request
            request.current_user = payload.get('user')
            return f(*args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            logger.warning("Expired JWT token attempted")
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid JWT token attempted: {type(e).__name__}")
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            # Log the actual error for debugging but return generic message
            logger.error(f"Authentication error: {type(e).__name__}: {str(e)}")
            return jsonify({'error': 'Authentication failed'}), 401
    
    return decorated_function
