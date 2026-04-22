from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

BOWL = {"broth_id": "tonkotsu", "noodles_id": "wavy", "topping_ids": ["chashu", "soft-egg"]}


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_create_order():
    r = client.post("/orders", json={"bowl": BOWL})
    assert r.status_code == 201
    order = r.json()
    assert order["status"] == "pending"
    assert "id" in order
    assert order["bowl"]["broth_id"] == "tonkotsu"


def test_get_order():
    r = client.post("/orders", json={"bowl": BOWL})
    order_id = r.json()["id"]
    r2 = client.get(f"/orders/{order_id}")
    assert r2.status_code == 200
    assert r2.json()["id"] == order_id


def test_list_orders():
    r = client.get("/orders")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_advance_order():
    r = client.post("/orders", json={"bowl": BOWL})
    order_id = r.json()["id"]
    r2 = client.patch(f"/orders/{order_id}/advance")
    assert r2.status_code == 200
    assert r2.json()["status"] == "preparing"


def test_advance_delivered_order_fails():
    r = client.post("/orders", json={"bowl": BOWL})
    order_id = r.json()["id"]
    for _ in range(3):
        client.patch(f"/orders/{order_id}/advance")
    r2 = client.patch(f"/orders/{order_id}/advance")
    assert r2.status_code == 400


def test_get_nonexistent_order():
    r = client.get("/orders/does-not-exist")
    assert r.status_code == 404


def test_delete_order():
    r = client.post("/orders", json={"bowl": BOWL})
    order_id = r.json()["id"]
    r2 = client.delete(f"/orders/{order_id}")
    assert r2.status_code == 204
    r3 = client.get(f"/orders/{order_id}")
    assert r3.status_code == 404
