"""Tests for health check endpoint."""
import json


def test_health_check(client):
    """Test the health check endpoint returns expected response."""
    response = client.get('/api/health')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert data['service'] == 'LedgerFlow Backend'
    assert 'timestamp' in data
