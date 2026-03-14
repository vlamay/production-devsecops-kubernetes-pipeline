"""Tests for POST /register endpoint."""


def test_register_success(client):
    """A valid registration should return 201 with UserOut fields."""
    payload = {"username": "sentinel_user", "password": "Str0ngP@ss!"}
    response = client.post("/register", json=payload)

    assert response.status_code == 201

    data = response.json()
    assert data["username"] == "sentinel_user"
    assert "id" in data
    assert "created_at" in data
    # Password must never appear in the response
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_username(client):
    """Registering the same username twice should return 400."""
    payload = {"username": "duplicate_user", "password": "Str0ngP@ss!"}
    client.post("/register", json=payload)

    response = client.post("/register", json=payload)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_register_missing_fields(client):
    """Missing required fields should return 422 (validation error)."""
    response = client.post("/register", json={})
    assert response.status_code == 422


def test_register_short_username(client):
    """Username below min_length should return 422."""
    payload = {"username": "ab", "password": "Str0ngP@ss!"}
    response = client.post("/register", json=payload)
    assert response.status_code == 422


def test_register_short_password(client):
    """Password below min_length should return 422."""
    payload = {"username": "valid_user", "password": "short"}
    response = client.post("/register", json=payload)
    assert response.status_code == 422
