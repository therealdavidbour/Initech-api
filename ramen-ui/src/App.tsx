import { useState } from "react";
import BowlBuilder from "./components/BowlBuilder";
import OrderTracker from "./components/OrderTracker";

type Tab = "build" | "track";

export default function App() {
  const [tab, setTab] = useState<Tab>("build");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#f8f9fa" }}>
      <header style={{ background: "#1a1a2e", color: "#fff", padding: "1rem 2rem" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>🍜 Ramen Shop</h1>
          <nav style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            {(["build", "track"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "0.4rem 1rem",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                  background: tab === t ? "#e85d04" : "rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
              >
                {t === "build" ? "Build a Bowl" : "Order Tracker"}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ padding: "1.5rem 1rem" }}>
        {tab === "build" ? <BowlBuilder /> : <OrderTracker />}
      </main>
    </div>
  );
}
