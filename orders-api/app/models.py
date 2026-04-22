from pydantic import BaseModel
from typing import List
from enum import Enum
from datetime import datetime


class OrderStatus(str, Enum):
    pending = "pending"
    preparing = "preparing"
    ready = "ready"
    delivered = "delivered"


STATUS_TRANSITIONS = {
    OrderStatus.pending: OrderStatus.preparing,
    OrderStatus.preparing: OrderStatus.ready,
    OrderStatus.ready: OrderStatus.delivered,
}


class BowlConfig(BaseModel):
    broth_id: str
    noodles_id: str
    topping_ids: List[str]


class OrderCreate(BaseModel):
    bowl: BowlConfig


class Order(BaseModel):
    id: str
    bowl: BowlConfig
    status: OrderStatus
    created_at: datetime
    updated_at: datetime
