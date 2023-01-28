import { FiShoppingCart } from "react-icons/fi";

interface ItemProps {
  id: number;
  name: string;
  price: number;
  owned: boolean;
  tryBuy: (id: number) => Promise<void>;
}

function ShopItem({ id, name, price, owned, tryBuy }: ItemProps) {
  return (
    <div
      className={"flex flex-row justify-between items-center p-3 border-b-2"}
    >
      <div className={"flex flex-row justify-start items-center"}>
        <p className={"ml-2"}>{name}</p>
      </div>
      <div className={"flex flex-row justify-end items-center"}>
        <p className={"mr-2"}>{price}</p>
        <FiShoppingCart
          className={"h-6 w-6 cursor-pointer"}
          onClick={() => tryBuy(id)}
        />
      </div>
      {owned ? "OWNED" : "NOT OWNED"}
    </div>
  );
}

export { ShopItem };
