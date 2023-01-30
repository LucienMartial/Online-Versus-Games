import { AiOutlineSelect } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegAngry } from "react-icons/fa";
import { FaEuroSign } from "react-icons/fa";

interface ItemProps {
  id: number;
  name: string;
  price: number;
  category: string;
  owned: boolean;
  selected: boolean;
  tryBuy: (id: number) => Promise<void>;
  trySelect: (id: number) => void;
}

function ShopItem({
  id,
  name,
  price,
  category,
  owned,
  selected,
  tryBuy,
  trySelect,
}: ItemProps) {
  return (
    <div
      className={"flex flex-row justify-between items-center p-3 border-b-2"}
    >
      <div className={"flex flex-row justify-start items-center"}>
        <p className={"ml-2"}>{name}</p>
      </div>
      <div className={"flex flex-row justify-end items-center"}>
        {owned ? (
          ""
        ) : (
          <p className={"mr-2"}>
            {price} <FaEuroSign />
          </p>
        )}
        {owned ? (
          selected ? (
            <FaRegAngry />
          ) : (
            <AiOutlineSelect onClick={() => trySelect(id)} />
          )
        ) : (
          <FiShoppingCart
            className={"h-6 w-6 cursor-pointer"}
            onClick={() => tryBuy(id)}
          />
        )}
      </div>
    </div>
  );
}

export { ShopItem };
