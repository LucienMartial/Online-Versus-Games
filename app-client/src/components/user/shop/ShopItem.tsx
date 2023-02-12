import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";
import { CosmeticAssets } from "../../../game/configs/assets-config";
import { ShopButton } from "./ShopButton";
import { useEffect, useRef, useState } from "react";
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
  cosmetics: CosmeticAssets | null;
  tryBuy: (id: number) => Promise<void>;
  trySelect: (id: number) => void;
  tryPreview: (id: number) => void;
}

const CANVAS_WIDTH = 50;
const CANVAS_WIDTH_COLOR = 100;
const CANVAS_HEIGHT = 50;
const CANVAS_HEIGHT_COLOR = 25;

function ShopItem({
  id,
  name,
  price,
  category,
  owned,
  selected,
  previewed,
  ableToBuy,
  cosmetics,
  tryBuy,
  trySelect,
  tryPreview,
}: ItemProps) {
  const [app, setApp] = useState<Application>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const application = new Application({
      width: category === "skin" ? CANVAS_WIDTH_COLOR : CANVAS_WIDTH,
      height: category === "skin" ? CANVAS_HEIGHT_COLOR : CANVAS_HEIGHT,
      backgroundAlpha: 0,
      view: canvasRef.current === null ? undefined : canvasRef.current,
    });
    setApp(application);
  }, []);

  useEffect(() => {
    if (cosmetics && app) {
      app.stage.removeChildren();
      if (category === "skin") {
        loadColor();
      } else {
        loadImage();
      }
    }
  }, [app, cosmetics]);

  function loadColor() {
    if (app === undefined) return;
    const container = new Container();
    const skin = new Graphics();

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

    skin.beginFill(color);
    skin.drawRect(0, 0, CANVAS_WIDTH_COLOR, CANVAS_HEIGHT_COLOR);
    skin.endFill();
    container.addChild(skin);
    app.stage.addChild(container);
  }

  function loadImage() {
    if (app === undefined || cosmetics === null) return;
    const container = new Container();

    function loadSprite(texture: Texture): void {
      const sprite = new Sprite(texture);
      sprite.pivot.set(sprite.width / 2, sprite.height / 2);
      sprite.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      sprite.scale.set(0.1, 0.1);
      container.addChild(sprite);
    }

    switch (id) {
      case 20:
        loadSprite(cosmetics.gray_hat);
        break;
      case 21:
        loadSprite(cosmetics.red_cap);
        break;
      case 22:
        loadSprite(cosmetics.black_hat);
        break;
      case 40:
        loadSprite(cosmetics.black_sunglasses);
        break;
      case 41:
        loadSprite(cosmetics.pink_sunglasses);
        break;
      case 42:
        loadSprite(cosmetics.red_eyes);
        break;
      case 43:
        loadSprite(cosmetics.gray_sunglasses);
        break;
      case 44:
        loadSprite(cosmetics.gas_mask);
        break;
      case 45:
        loadSprite(cosmetics.brown_diving_mask);
      default:
        break;
    }

    app.stage.addChild(container);
  }

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
        <canvas ref={canvasRef} className={""}></canvas>
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
