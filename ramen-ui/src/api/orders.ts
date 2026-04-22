import type { BowlConfig, Order } from "../types";

const BASE = import.meta.env.VITE_ORDERS_API_URL ?? "https://orders-api.10-0-0-200.nip.io";

export const listOrders = (): Promise<Order[]> =>
  fetch(`${BASE}/orders`).then((r) => r.json());

export const createOrder = (bowl: BowlConfig): Promise<Order> =>
  fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bowl }),
  }).then((r) => r.json());

export const advanceOrder = (id: string): Promise<Order> =>
  fetch(`${BASE}/orders/${id}/advance`, { method: "PATCH" }).then((r) => r.json());
