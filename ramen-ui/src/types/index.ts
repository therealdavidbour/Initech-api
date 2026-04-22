export interface Ingredient {
  id: string;
  name: string;
  description: string;
}

export interface BowlConfig {
  broth_id: string;
  noodles_id: string;
  topping_ids: string[];
}

export interface RandomBowl {
  broth: Ingredient;
  noodles: Ingredient;
  toppings: Ingredient[];
}

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

export interface Order {
  id: string;
  bowl: BowlConfig;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}
