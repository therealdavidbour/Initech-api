import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./api/recipe", () => ({
  getBroths: vi.fn().mockResolvedValue([]),
  getNoodles: vi.fn().mockResolvedValue([]),
  getToppings: vi.fn().mockResolvedValue([]),
  randomize: vi.fn(),
}));

vi.mock("./api/orders", () => ({
  listOrders: vi.fn().mockResolvedValue([]),
  createOrder: vi.fn(),
  advanceOrder: vi.fn(),
}));

describe("App", () => {
  it("renders the page title", () => {
    render(<App />);
    expect(screen.getByText("🍜 Ramen Shop")).toBeTruthy();
  });

  it("shows Build a Bowl tab by default", () => {
    render(<App />);
    expect(screen.getByText("Build a Bowl")).toBeTruthy();
  });

  it("shows Order Tracker tab button", () => {
    render(<App />);
    expect(screen.getByText("Order Tracker")).toBeTruthy();
  });
});
