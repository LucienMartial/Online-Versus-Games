type ItemCategory = "skin" | "hat" | "face";

interface Item {
  id: number;
  name: string;
  price: number;
  category: ItemCategory;
}

export type { Item };
