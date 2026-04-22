import { useEffect, useState } from "react";
import type { Ingredient, BowlConfig } from "../types";
import { getBroths, getNoodles, getToppings, randomize } from "../api/recipe";
import { createOrder } from "../api/orders";

export default function BowlBuilder() {
  const [broths, setBroths] = useState<Ingredient[]>([]);
  const [noodles, setNoodles] = useState<Ingredient[]>([]);
  const [toppings, setToppings] = useState<Ingredient[]>([]);

  const [selectedBroth, setSelectedBroth] = useState("");
  const [selectedNoodles, setSelectedNoodles] = useState("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getBroths(), getNoodles(), getToppings()]).then(([b, n, t]) => {
      setBroths(b);
      setNoodles(n);
      setToppings(t);
    });
  }, []);

  const handleRandomize = async () => {
    const bowl = await randomize();
    setSelectedBroth(bowl.broth.id);
    setSelectedNoodles(bowl.noodles.id);
    setSelectedToppings(bowl.toppings.map((t) => t.id));
  };

  const handlePlaceOrder = async () => {
    if (!selectedBroth || !selectedNoodles) {
      setToast("Please pick a broth and noodles first.");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setLoading(true);
    const bowl: BowlConfig = {
      broth_id: selectedBroth,
      noodles_id: selectedNoodles,
      topping_ids: selectedToppings,
    };
    const order = await createOrder(bowl);
    setLoading(false);
    setToast(`Order placed! ID: ${order.id}`);
    setTimeout(() => setToast(null), 5000);
  };

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Build Your Bowl</h2>
        <button onClick={handleRandomize} style={btnStyle("#6c757d")}>
          🎲 Randomize
        </button>
      </div>

      <section style={sectionStyle}>
        <h3>Broth</h3>
        <div style={gridStyle}>
          {broths.map((b) => (
            <label key={b.id} style={cardStyle(selectedBroth === b.id)}>
              <input
                type="radio"
                name="broth"
                value={b.id}
                checked={selectedBroth === b.id}
                onChange={() => setSelectedBroth(b.id)}
                style={{ display: "none" }}
              />
              <strong>{b.name}</strong>
              <small style={{ color: "#666" }}>{b.description}</small>
            </label>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h3>Noodles</h3>
        <div style={gridStyle}>
          {noodles.map((n) => (
            <label key={n.id} style={cardStyle(selectedNoodles === n.id)}>
              <input
                type="radio"
                name="noodles"
                value={n.id}
                checked={selectedNoodles === n.id}
                onChange={() => setSelectedNoodles(n.id)}
                style={{ display: "none" }}
              />
              <strong>{n.name}</strong>
              <small style={{ color: "#666" }}>{n.description}</small>
            </label>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h3>Toppings</h3>
        <div style={gridStyle}>
          {toppings.map((t) => (
            <label key={t.id} style={cardStyle(selectedToppings.includes(t.id))}>
              <input
                type="checkbox"
                value={t.id}
                checked={selectedToppings.includes(t.id)}
                onChange={() => toggleTopping(t.id)}
                style={{ display: "none" }}
              />
              <strong>{t.name}</strong>
              <small style={{ color: "#666" }}>{t.description}</small>
            </label>
          ))}
        </div>
      </section>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        style={{ ...btnStyle("#e85d04"), width: "100%", padding: "0.75rem", fontSize: "1.1rem", marginTop: "1rem" }}
      >
        {loading ? "Placing order..." : "🍜 Place Order"}
      </button>

      {toast && (
        <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#d4edda", borderRadius: 6, color: "#155724" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

const sectionStyle: React.CSSProperties = { marginBottom: "1.5rem" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" };

const cardStyle = (selected: boolean): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  padding: "0.6rem 0.75rem",
  border: `2px solid ${selected ? "#e85d04" : "#dee2e6"}`,
  borderRadius: 8,
  cursor: "pointer",
  background: selected ? "#fff3ee" : "#fff",
  transition: "border-color 0.15s",
});

const btnStyle = (bg: string): React.CSSProperties => ({
  padding: "0.5rem 1rem",
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
});
