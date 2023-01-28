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
];

const DEFAULT_SKIN = 0x00ffff;

function getItem(id: number): Item | null {
  return SHOP_ITEMS[id];
}

export { SHOP_ITEMS, DEFAULT_SKIN, getItem };
