import { Item } from "../types/index.js";

const SHOP_ITEMS: Item[] = [
  {
    id: -1,
    name: "Basic skin",
    price: 0,
    category: "skin",
  },
  {
    id: 0,
    name: "Red skin",
    price: 10,
    category: "skin",
  },
  {
    id: 1,
    name: "Blue skin",
    price: 10,
    category: "skin",
  },
  {
    id: 2,
    name: "Green skin",
    price: 10,
    category: "skin",
  },
  {
    id: 3,
    name: "Yellow skin",
    price: 10,
    category: "skin",
  },
  {
    id: -2,
    name: "No hat",
    price: 0,
    category: "hat",
  },
  {
    id: 20,
    name: "Melon hat",
    price: 50,
    category: "hat",
  },
  {
    id: 21,
    name: "Blue cap",
    price: 20,
    category: "hat",
  },
  {
    id: -3,
    name: "No face",
    price: 0,
    category: "face",
  },
  {
    id: 40,
    name: "Black sunglasses",
    price: 50,
    category: "face",
  },
  {
    id: 41,
    name: "Pink sunglasses",
    price: 10,
    category: "face",
  },
  {
    id: 42,
    name: "Red eyes",
    price: 40,
    category: "face",
  },
];

const DEFAULT_SKIN = 0x009999;

function getItem(id: number): Item | null {
  return SHOP_ITEMS.find((item) => item.id === id) || null;
}

export { SHOP_ITEMS, DEFAULT_SKIN, getItem };
