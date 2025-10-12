"""Tests for settings routes (tax, notification, security)."""
import json
import jwt
import datetime


def test_get_tax_settings_none(client):
    """Test getting tax settings when none exist."""
    response = client.get('/api/tax-settings')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data is None


def test_create_tax_settings(client):
    """Test creating tax settings."""
    tax_data = {
        'enableTaxes': True,
        'taxBasis': 'accrual',
        'pricesIncludeTax': False,
        'defaultTaxRate': 10.0,
        'org': {
            'entityType': 'llc',
            'taxId': 'TAX-123456',
            'country': 'USA',
            'region': 'CA'
        },
        'rates': [
            {'name': 'Sales Tax', 'rate': 7.5, 'compound': False},
            {'name': 'State Tax', 'rate': 2.5, 'compound': True}
        ]
    }
    
    response = client.post('/api/tax-settings',
                          data=json.dumps(tax_data),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    assert 'id' in data


def test_get_tax_settings_after_create(client):
    """Test getting tax settings after creating them."""
    tax_data = {
        'defaultTaxRate': 15.0,
        'org': {
            'entityType': 'corporation',
            'taxId': 'CORP-123'
        },
        'rates': [
            {'name': 'VAT', 'rate': 20.0, 'compound': False}
        ]
    }
    client.post('/api/tax-settings',
               data=json.dumps(tax_data),
               content_type='application/json')
    
    response = client.get('/api/tax-settings')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['defaultTaxRate'] == 15.0
    assert data['org']['entityType'] == 'corporation'
    assert len(data['rates']) == 1
    assert data['rates'][0]['name'] == 'VAT'


def test_update_tax_settings(client):
    """Test updating existing tax settings."""
    # Create initial settings
    initial_data = {
        'defaultTaxRate': 10.0,
        'rates': [
            {'name': 'Tax 1', 'rate': 5.0, 'compound': False}
        ]
    }
    client.post('/api/tax-settings',
               data=json.dumps(initial_data),
               content_type='application/json')
    
    # Update settings
    update_data = {
        'defaultTaxRate': 12.0,
        'rates': [
            {'name': 'Updated Tax', 'rate': 8.0, 'compound': True}
        ]
    }
    response = client.post('/api/tax-settings',
                          data=json.dumps(update_data),
                          content_type='application/json')
    assert response.status_code == 200
    
    # Verify update
    get_response = client.get('/api/tax-settings')
    data = json.loads(get_response.data)
    assert data['defaultTaxRate'] == 12.0
    assert data['rates'][0]['name'] == 'Updated Tax'


def test_get_notification_settings_none(client):
    """Test getting notification settings when none exist."""
    response = client.get('/api/notification-settings')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data is None


def test_create_notification_settings(client):
    """Test creating notification settings."""
    notification_data = {
        'enableEmail': True,
        'emailAddress': 'notifications@example.com',
        'enableSms': True,
        'phoneNumber': '555-1234'
    }
    
    response = client.post('/api/notification-settings',
                          data=json.dumps(notification_data),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'


def test_get_notification_settings_after_create(client):
    """Test getting notification settings after creating them."""
    notification_data = {
        'enableEmail': True,
        'emailAddress': 'test@example.com'
    }
    client.post('/api/notification-settings',
               data=json.dumps(notification_data),
               content_type='application/json')
    
    response = client.get('/api/notification-settings')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['enableEmail'] is True
    assert data['emailAddress'] == 'test@example.com'


def test_get_security_settings_none(client):
    """Test getting security settings when none exist."""
    response = client.get('/api/security/settings')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data is None


def test_create_security_settings(client):
    """Test creating security settings."""
    security_data = {
        'enable2fa': True,
        'twoFactorMethod': 'email'
    }
    
    response = client.post('/api/security/settings',
                          data=json.dumps(security_data),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'


def test_set_initial_password(client):
    """Test setting initial password."""
    password_data = {
        'password': 'SecurePassword123!'
    }
    
    response = client.post('/api/security/set-password',
                          data=json.dumps(password_data),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'


def test_set_password_already_set(client):
    """Test that setting password fails if already set."""
    # Set password first time
    client.post('/api/security/set-password',
               data=json.dumps({'password': 'FirstPassword123!'}),
               content_type='application/json')
    
    # Try to set again
    response = client.post('/api/security/set-password',
                          data=json.dumps({'password': 'SecondPassword123!'}),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data


def test_login_with_valid_password(client):
    """Test logging in with valid password."""
    # Set password
    client.post('/api/security/set-password',
               data=json.dumps({'password': 'MyPassword123!'}),
               content_type='application/json')
    
    # Login
    response = client.post('/api/security/login',
                          data=json.dumps({'password': 'MyPassword123!'}),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'token' in data


def test_login_with_invalid_password(client):
    """Test logging in with invalid password."""
    # Set password
    client.post('/api/security/set-password',
               data=json.dumps({'password': 'CorrectPassword123!'}),
               content_type='application/json')
    
    # Try to login with wrong password
    response = client.post('/api/security/login',
                          data=json.dumps({'password': 'WrongPassword123!'}),
                          content_type='application/json')
    assert response.status_code == 401
    data = json.loads(response.data)
    assert 'error' in data


def test_login_no_password_set(client):
    """Test logging in when no password is set."""
    response = client.post('/api/security/login',
                          data=json.dumps({'password': 'AnyPassword123!'}),
                          content_type='application/json')
    assert response.status_code == 403
    data = json.loads(response.data)
    assert 'error' in data


def test_verify_valid_token(client):
    """Test verifying a valid JWT token."""
    # Set password and login
    client.post('/api/security/set-password',
               data=json.dumps({'password': 'TestPassword123!'}),
               content_type='application/json')
    login_response = client.post('/api/security/login',
                                 data=json.dumps({'password': 'TestPassword123!'}),
                                 content_type='application/json')
    token = json.loads(login_response.data)['token']
    
    # Verify token
    response = client.post('/api/security/verify-token',
                          data=json.dumps({'token': token}),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['valid'] is True
    assert data['user'] == 'admin'


def test_verify_invalid_token(client):
    """Test verifying an invalid token."""
    response = client.post('/api/security/verify-token',
                          data=json.dumps({'token': 'invalid.token.here'}),
                          content_type='application/json')
    assert response.status_code == 401
    data = json.loads(response.data)
    assert data['valid'] is False
    assert 'error' in data


def test_change_password(client):
    """Test changing password."""
    # Set initial password
    client.post('/api/security/set-password',
               data=json.dumps({'password': 'OldPassword123!'}),
               content_type='application/json')
    
    # Change password
    response = client.post('/api/security/change-password',
                          data=json.dumps({
                              'currentPassword': 'OldPassword123!',
                              'newPassword': 'NewPassword123!'
                          }),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    
    # Verify new password works
    login_response = client.post('/api/security/login',
                                 data=json.dumps({'password': 'NewPassword123!'}),
                                 content_type='application/json')
    assert login_response.status_code == 200


def test_change_password_wrong_current(client):
    """Test changing password with wrong current password."""
    # Set initial password
    client.post('/api/security/set-password',
               data=json.dumps({'password': 'CorrectPassword123!'}),
               content_type='application/json')
    
    # Try to change with wrong current password
    response = client.post('/api/security/change-password',
                          data=json.dumps({
                              'currentPassword': 'WrongPassword123!',
                              'newPassword': 'NewPassword123!'
                          }),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data


def test_change_password_missing_fields(client):
    """Test changing password with missing fields."""
    response = client.post('/api/security/change-password',
                          data=json.dumps({
                              'currentPassword': 'OnlyOne'
                          }),
                          content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
