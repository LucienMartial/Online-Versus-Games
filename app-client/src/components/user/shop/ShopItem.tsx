import { ShopButton } from "./ShopButton";

interface ItemProps {
  id: number;
  name: string;
  price: number;
  category: string;
  owned: boolean;
  selected: boolean;
  previewed: boolean;
  ableToBuy: boolean;
  tryBuy: (id: number) => Promise<void>;
  trySelect: (id: number) => void;
  tryPreview: (id: number) => void;
}

function ShopItem({
  id,
  name,
  price,
  category,
  owned,
  selected,
  previewed,
  ableToBuy,
  tryBuy,
  trySelect,
  tryPreview,
}: ItemProps) {
  function buyButton() {
    return (
      <ShopButton
        onClick={() => tryBuy(id)}
        feature={"buy"}
        grayedOut={!ableToBuy}
      >
        Buy ({price} {price > 1 ? "coins" : "coin"})
      </ShopButton>
    );
  }

  function previewButton() {
    return (
      <ShopButton onClick={() => tryPreview(id)} feature={"preview"}>
        Preview item
      </ShopButton>
    );
  }

  function selectButton() {
    return (
      <ShopButton onClick={() => trySelect(id)} feature={"select"}>
        Select
      </ShopButton>
    );
  }

  function itemStyle() {
    if (previewed) {
      if (selected) {
        return "text-xl grid grid-raws-3 p-5 rounded-xl m-3 border-2 animate-pulse border-pink-900";
      }
      return "text-xl grid grid-raws-3 p-5 rounded-xl m-3 border-2 animate-pulse border-lime-900";
    }

    return "text-lg grid grid-raws-3 p-5 rounded-xl m-3 border-2 border-blue-400";
  }

  return (
    <div className={itemStyle()}>
      <div className={"font-bold"}>
        {name + (!owned && !previewed ? " (" + price + " coins)" : "")}
      </div>
      <div className={"my-3"}>
        {/*Here will be the image of the item*/ "IMAGE"}
      </div>
      <div
        className={
          owned && selected && previewed
            ? "bg-pink-900 text-white font-bold py-2.5 px-5 rounded w-full"
            : "w-full"
        }
      >
        {owned
          ? selected && previewed
            ? "Selected"
            : selectButton()
          : previewed
          ? buyButton()
          : previewButton()}
      </div>
    </div>
  );
}

export { ShopItem };
