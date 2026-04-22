import type { Ingredient, RandomBowl } from "../types";

const BASE = import.meta.env.VITE_RECIPE_API_URL ?? "https://recipe-api.10-0-0-200.nip.io";

export const getBroths = (): Promise<Ingredient[]> =>
  fetch(`${BASE}/broths`).then((r) => r.json());

export const getNoodles = (): Promise<Ingredient[]> =>
  fetch(`${BASE}/noodles`).then((r) => r.json());

export const getToppings = (): Promise<Ingredient[]> =>
  fetch(`${BASE}/toppings`).then((r) => r.json());

export const randomize = (): Promise<RandomBowl> =>
  fetch(`${BASE}/randomize`).then((r) => r.json());
