import { AiOutlineSelect } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";

interface ItemProps {
  id: number;
  name: string;
  price: number;
  owned: boolean;
  selected: boolean;
  tryBuy: (id: number) => Promise<void>;
  trySelect: (id: number) => Promise<void>;
}

function ShopItem({
  id,
  name,
  price,
  owned,
  selected,
  tryBuy,
  trySelect,
}: ItemProps) {
  return (
    <div
      className={"flex flex-row justify-between items-center p-3 border-b-2"}
    >
      ID = {id}
      <div className={"flex flex-row justify-start items-center"}>
        <p className={"ml-2"}>{name}</p>
      </div>
      <div className={"flex flex-row justify-end items-center"}>
        {owned ? "" : <p className={"mr-2"}>{price}</p>}
        {owned ? (
          <AiOutlineSelect onClick={() => trySelect(id)} />
        ) : (
          <FiShoppingCart
            className={"h-6 w-6 cursor-pointer"}
            onClick={() => tryBuy(id)}
          />
        )}
      </div>
      {selected ? "SELECTED" : "NOT SELECTED"}
    </div>
  );
}

export { ShopItem };
