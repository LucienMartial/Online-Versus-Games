import { ItemDisplay } from "../../../../../app-shared/types";
import { ShopItem } from "./ShopItem";

interface ShopCategoryProps {
  items: ItemDisplay[];
}

function ShopCategory({ items }: ShopCategoryProps) {
  return (
    <div
      className={
        "grid " +
        (items.length < 8
          ? items.length < 2
            ? "sm:grid-cols-1"
            : "sm:grid-cols-2"
          : "sm:grid-cols-3") +
        " grid-cols-1 overflow-y-auto max-h-full min-h-0"
      }
    >
      {items.map((item) => (
        <ShopItem {...item} key={item.id} />
      ))}
    </div>
  );
}

export { ShopCategory };
