from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_broths_returns_list():
    r = client.get("/broths")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert all("id" in item and "name" in item for item in data)


def test_noodles_returns_list():
    r = client.get("/noodles")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_toppings_returns_list():
    r = client.get("/toppings")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_randomize_returns_bowl():
    r = client.get("/randomize")
    assert r.status_code == 200
    body = r.json()
    assert "broth" in body
    assert "noodles" in body
    assert "toppings" in body
    assert isinstance(body["toppings"], list)
    assert 2 <= len(body["toppings"]) <= 4
