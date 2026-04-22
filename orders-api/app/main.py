import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import Order, OrderCreate, OrderStatus, STATUS_TRANSITIONS

app = FastAPI(title="Orders API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_orders: dict[str, Order] = {}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/orders", status_code=201)
def create_order(payload: OrderCreate) -> Order:
    now = datetime.now(timezone.utc)
    order = Order(
        id=str(uuid.uuid4()),
        bowl=payload.bowl,
        status=OrderStatus.pending,
        created_at=now,
        updated_at=now,
    )
    _orders[order.id] = order
    return order


@app.get("/orders")
def list_orders() -> list[Order]:
    return list(_orders.values())


@app.get("/orders/{order_id}")
def get_order(order_id: str) -> Order:
    order = _orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.patch("/orders/{order_id}/advance")
def advance_order(order_id: str) -> Order:
    order = _orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    next_status = STATUS_TRANSITIONS.get(order.status)
    if not next_status:
        raise HTTPException(status_code=400, detail=f"Order is already {order.status}")
    order.status = next_status
    order.updated_at = datetime.now(timezone.utc)
    return order


@app.delete("/orders/{order_id}", status_code=204)
def delete_order(order_id: str):
    if order_id not in _orders:
        raise HTTPException(status_code=404, detail="Order not found")
    del _orders[order_id]
