"""Tests for utility functions."""
from utils import parse_float, normalize_status, serialize_invoice


def test_parse_float_valid():
    """Test parse_float with valid inputs."""
    assert parse_float('10.5') == 10.5
    assert parse_float(20) == 20.0
    assert parse_float(30.7) == 30.7


def test_parse_float_invalid():
    """Test parse_float with invalid inputs."""
    assert parse_float(None) == 0.0
    assert parse_float('') == 0.0
    assert parse_float('invalid') == 0.0
    assert parse_float(None, 5.0) == 5.0


def test_normalize_status_valid():
    """Test normalize_status with valid statuses."""
    assert normalize_status('draft') == 'draft'
    assert normalize_status('SENT') == 'sent'
    assert normalize_status('Paid') == 'paid'
    assert normalize_status('overdue') == 'overdue'


def test_normalize_status_invalid():
    """Test normalize_status with invalid statuses defaults to draft."""
    assert normalize_status('invalid') == 'draft'
    assert normalize_status('') == 'draft'
    assert normalize_status(None) == 'draft'


def test_normalize_status_custom_allowed():
    """Test normalize_status with custom allowed statuses."""
    allowed = {'pending', 'complete'}
    assert normalize_status('pending', allowed) == 'pending'
    assert normalize_status('draft', allowed) == 'draft'  # Falls back to draft
