type ItemCategory = "skin" | "hat" | "face";

interface Item {
  id: number;
  name: string;
  price: number;
  category: ItemCategory;
}

interface ItemDisplay extends Item {
  owned: boolean;
  selected: boolean;
  previewed: boolean;
  ableToBuy: boolean;
  tryBuy: (id: number) => Promise<void>;
  trySelect: (id: number) => void;
  tryPreview: (id: number) => void;
}

export type { Item, ItemDisplay };
