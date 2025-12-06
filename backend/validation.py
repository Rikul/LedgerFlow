"""Input validation and sanitization utilities."""
import re
from typing import Any, Optional


def sanitize_string(value: Any, max_length: Optional[int] = None, allow_empty: bool = True) -> Optional[str]:
    """
    Sanitize string input by stripping whitespace and optionally limiting length.
    
    Args:
        value: Input value to sanitize
        max_length: Maximum allowed length (None for no limit)
        allow_empty: Whether to allow empty strings (False returns None for empty)
    
    Returns:
        Sanitized string or None
    """
    if value is None:
        return None
    
    # Convert to string and strip whitespace
    sanitized = str(value).strip()
    
    # Check if empty
    if not sanitized:
        return None if not allow_empty else sanitized
    
    # Apply length limit
    if max_length and len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized


def validate_email(email: str) -> bool:
    """
    Validate email address format.
    
    Args:
        email: Email address to validate
    
    Returns:
        True if valid, False otherwise
    """
    if not email:
        return False
    
    # Basic email validation pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """
    Validate phone number format (allows common formats).
    
    Args:
        phone: Phone number to validate
    
    Returns:
        True if valid, False otherwise
    """
    if not phone:
        return True  # Phone is optional
    
    # Allow digits, spaces, dashes, parentheses, plus sign
    pattern = r'^[\d\s\-\(\)\+]+$'
    if not re.match(pattern, phone):
        return False
    
    # Check if has at least 7 digits
    digits = re.sub(r'\D', '', phone)
    return len(digits) >= 7


def sanitize_html(text: str) -> str:
    """
    Remove HTML tags and potentially dangerous content from text.
    
    Args:
        text: Input text to sanitize
    
    Returns:
        Sanitized text without HTML tags
    """
    if not text:
        return text
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove common XSS patterns
    text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
    text = re.sub(r'on\w+\s*=', '', text, flags=re.IGNORECASE)
    
    return text


def validate_positive_float(value: Any, field_name: str = "Value") -> tuple[bool, Optional[str], Optional[float]]:
    """
    Validate that a value is a positive float.
    
    Args:
        value: Value to validate
        field_name: Name of the field for error messages
    
    Returns:
        Tuple of (is_valid, error_message, parsed_value)
    """
    try:
        parsed = float(value)
        if parsed <= 0:
            return False, f"{field_name} must be greater than zero", None
        return True, None, parsed
    except (TypeError, ValueError):
        return False, f"{field_name} must be a valid number", None


def validate_required_fields(data: dict, required_fields: list[str]) -> tuple[bool, Optional[str]]:
    """
    Validate that required fields are present and non-empty in data.
    
    Args:
        data: Dictionary of data to validate
        required_fields: List of required field names
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    missing = []
    for field in required_fields:
        value = data.get(field)
        if value is None or (isinstance(value, str) and not value.strip()):
            missing.append(field)
    
    if missing:
        return False, f"Required fields missing or empty: {', '.join(missing)}"
    
    return True, None


def validate_string_length(value: str, min_length: int = 0, max_length: Optional[int] = None, 
                          field_name: str = "Field") -> tuple[bool, Optional[str]]:
    """
    Validate string length constraints.
    
    Args:
        value: String to validate
        min_length: Minimum allowed length
        max_length: Maximum allowed length (None for no limit)
        field_name: Name of the field for error messages
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not value:
        if min_length > 0:
            return False, f"{field_name} is required"
        return True, None
    
    length = len(value)
    
    if length < min_length:
        return False, f"{field_name} must be at least {min_length} characters"
    
    if max_length and length > max_length:
        return False, f"{field_name} must not exceed {max_length} characters"
    
    return True, None
