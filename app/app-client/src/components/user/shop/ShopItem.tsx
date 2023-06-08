import { ShopButton } from "./ShopButton";
import { useEffect, useRef } from "react";
import { DEFAULT_SKIN } from "../../../../../app-shared/configs/shop-config";

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

const IMG_WIDTH = 48;
const IMG_HEIGHT = 48;
const CANVAS_WIDTH_COLOR = 100;
const CANVAS_HEIGHT_COLOR = 25;

function pickColorWithID(id: number, category: string): number {
  if (category !== "skin") {
    return DEFAULT_SKIN;
  }

  let color = DEFAULT_SKIN;

  switch (id) {
    case 0:
      color = 0x990000;
      break;
    case 1:
      color = 0x000099;
      break;
    case 2:
      color = 0x009900;
      break;
    case 3:
      color = 0x999900;
      break;
    default:
      break;
  }

  return color;
}

function pickURLWithID(id: number, category: string): string {
  if (category !== "hat" && category !== "face") {
    return "";
  }

  switch (id) {
    case 20:
      return "../assets/cosmetics/gray_hat.png";
    case 21:
      return "../assets/cosmetics/red_cap.png";
    case 22:
      return "../assets/cosmetics/black_hat.png";
    case 40:
      return "../assets/cosmetics/black_sunglasses.png";
    case 41:
      return "../assets/cosmetics/pink_sunglasses.png";
    case 42:
      return "../assets/cosmetics/red_eyes.png";
    case 43:
      return "../assets/cosmetics/gray_sunglasses.png";
    case 44:
      return "../assets/cosmetics/gas_mask.png";
    case 45:
      return "../assets/cosmetics/brown_diving_mask.png";
    default:
      return "";
  }
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const COSMETIC_URL: string = pickURLWithID(id, category);
  const COLOR_NUMBER: number = pickColorWithID(id, category);

  useEffect(() => {
    if (category === "skin") {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const colorStr = COLOR_NUMBER.toString(16).padStart(6, "0");
      ctx.fillStyle = `#${colorStr}`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {};
  }, []);

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
      <div className={"flex justify-center my-3"}>
        {category === "skin" ? (
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH_COLOR}
            height={CANVAS_HEIGHT_COLOR}
            className={"border border-gray-400 rounded-sm"}
          ></canvas>
        ) : COSMETIC_URL === "" ? (
          <div
            className={
              "w-12 h-12 border border-gray-400 rounded bg-slate-500/50"
            }
          ></div>
        ) : (
          <img width={IMG_WIDTH} height={IMG_HEIGHT} src={COSMETIC_URL} alt="Shop item" />
        )}
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
