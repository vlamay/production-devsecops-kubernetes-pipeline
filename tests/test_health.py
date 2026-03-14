"""Tests for GET /health endpoint."""


def test_health_returns_200(client):
    """GET /health should return 200 with status and timestamp keys."""
    response = client.get("/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"
    assert "timestamp" in data


def test_health_timestamp_is_iso_format(client):
    """The timestamp value should be a valid ISO-8601 string."""
    from datetime import datetime

    response = client.get("/health")
    ts = response.json()["timestamp"]
    # Will raise ValueError if format is invalid
    datetime.fromisoformat(ts)
