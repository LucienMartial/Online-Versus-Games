import { Item } from "../types/index.js";

const SHOP_ITEMS: Item[] = [
  {
    id: 0,
    name: "Red skin",
    price: 1,
    category: "skin",
  },
  {
    id: 1,
    name: "Blue skin",
    price: 1,
    category: "skin",
  },
  {
    id: 2,
    name: "Green skin",
    price: 1,
    category: "skin",
  },
  {
    id: 3,
    name: "Yellow skin",
    price: 1,
    category: "skin",
  },
  {
    id: 20,
    name: "Melon hat",
    price: 1,
    category: "hat",
  },
  {
    id: 21,
    name: "Blue cap",
    price: 1,
    category: "hat",
  },
  {
    id: 40,
    name: "Black sunglasses",
    price: 1,
    category: "face",
  },
  {
    id: 41,
    name: "Pink sunglasses",
    price: 1,
    category: "face",
  },
];

const DEFAULT_SKIN = 0x009999;

function getItem(id: number): Item | null {
  for (let i = 0; i < SHOP_ITEMS.length; i++) {
    const item = SHOP_ITEMS[i];
    if (item.id === id) {
      return item;
    }
  }
  return null;
}

export { SHOP_ITEMS, DEFAULT_SKIN, getItem };
