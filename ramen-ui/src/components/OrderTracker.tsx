import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "../types";
import { listOrders, advanceOrder } from "../api/orders";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#6c757d",
  preparing: "#fd7e14",
  ready: "#28a745",
  delivered: "#007bff",
};

const STATUS_NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Mark Delivered",
};

export default function OrderTracker() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = () => listOrders().then(setOrders);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvance = async (id: string) => {
    await advanceOrder(id);
    fetchOrders();
  };

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem", textAlign: "center", color: "#888" }}>
        <p>No orders yet. Build a bowl and place your first order!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem" }}>
      <h2>Order Tracker</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #dee2e6",
              borderRadius: 8,
              padding: "1rem",
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <code style={{ fontSize: "0.75rem", color: "#888" }}>{order.id}</code>
              <span
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: 20,
                  background: STATUS_COLORS[order.status],
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {order.status}
              </span>
            </div>

            <div style={{ fontSize: "0.9rem", color: "#444", marginBottom: "0.5rem" }}>
              <span><strong>Broth:</strong> {order.bowl.broth_id}</span>
              {" · "}
              <span><strong>Noodles:</strong> {order.bowl.noodles_id}</span>
              {order.bowl.topping_ids.length > 0 && (
                <span>{" · "}<strong>Toppings:</strong> {order.bowl.topping_ids.join(", ")}</span>
              )}
            </div>

            {STATUS_NEXT_LABEL[order.status] && (
              <button
                onClick={() => handleAdvance(order.id)}
                style={{
                  padding: "0.35rem 0.75rem",
                  background: STATUS_COLORS[order.status],
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {STATUS_NEXT_LABEL[order.status]}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
