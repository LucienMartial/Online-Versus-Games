import { AiOutlineSelect } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegAngry } from "react-icons/fa";
import { FaEuroSign } from "react-icons/fa";
import { ShopButton } from "./ShopButton";

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
  function itemStyle() {
    if (owned && selected) {
      return "grid grid-raws-3 p-5 rounded-xl m-3 border-2 border-pink-900 animate-pulse";
    }

    return "grid grid-raws-3 p-5 rounded-xl m-3 border-2 border-blue-400";
  }

  return (
    <div className={itemStyle()}>
      <div className={""}>
        <p className={"font-bold"}>{name}</p>
      </div>
      <div className={"my-3"}>
        {/*Here will be the image of the item*/ "IMAGE"}
      </div>
      <div
        className={
          owned && selected
            ? "bg-pink-900 text-white font-bold py-2.5 px-5 rounded w-full"
            : "w-full"
        }
      >
        {owned ? (
          selected ? (
            "Selected"
          ) : (
            <ShopButton onClick={() => trySelect(id)} feature={"select"}>
              Select
            </ShopButton>
          )
        ) : (
          <ShopButton onClick={() => tryBuy(id)} feature={"buy"}>
            Buy ({price} {price > 1 ? "coins" : "coin"})
          </ShopButton>
        )}
      </div>
    </div>
  );
}

export { ShopItem };
