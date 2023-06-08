// noinspection ES6UnusedImports

import { useRef, useEffect, useState } from "react";
import { PLAYER_RATIO } from "../../../../../app-shared/disc-war/player";
import { SelectedItems } from "../../../../../app-shared/types";
import {
  Application,
  Graphics,
  Sprite,
  Container,
  Loader,
  Texture,
} from "pixi.js";
import { CosmeticAssets } from "../../../game/configs/assets-config";
import { DEFAULT_SKIN } from "../../../../../app-shared/configs/shop-config";
import LoadingPage from "../../LoadingPage";

interface Position {
  x: number;
  y: number;
}

interface ShopPreviewProps {
  initWidth: number;
  initHeight: number;
  selectedItems: SelectedItems | null;
  cosmeticsAssets: CosmeticAssets | null;
}

function ShopPreview({
  initWidth,
  initHeight,
  selectedItems,
  cosmeticsAssets,
}: ShopPreviewProps) {
  const [app, setApp] = useState<Application>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvWidth, setcanvWidth] = useState<number>(initWidth);
  const [canHeight, setcanHeight] = useState<number>(initHeight);
  const [playerHeight, setPlayerHeight] = useState<number>(initHeight / 2);
  const [playerWidth, setPlayerWidth] = useState<number>(
    playerHeight * PLAYER_RATIO
  );
  const [rectPos, setRectPos] = useState<Position>({
    x: canvWidth / 2 - playerWidth / 2,
    y: canHeight / 2 - playerHeight / 3,
  });

  useEffect(() => {
    const application = new Application({
      width: canvWidth,
      height: canHeight,
      backgroundAlpha: 0,
      view: canvasRef.current === null ? undefined : canvasRef.current,
    });
    setApp(application);
  }, []);

  useEffect(() => {
    if (cosmeticsAssets && app) {
      loadCharacter();
    }
  }, [app, cosmeticsAssets, selectedItems, canvWidth, canHeight]);

  function loadCharacter() {
    if (app === undefined || selectedItems === null) return;
    app.stage.removeChildren();
    loadSkin(selectedItems.skinID);
    loadFace(selectedItems.faceID);
    loadHat(selectedItems.hatID);
  }

  function loadSkin(skinID: number): void {
    if (app === undefined) return;
    const skinContainer = new Container();
    const skin = new Graphics();
    let color = DEFAULT_SKIN;
    switch (skinID) {
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
    skin.drawRect(rectPos.x, rectPos.y, playerWidth, playerHeight);
    skin.endFill();
    skinContainer.addChild(skin);
    app.stage.addChild(skinContainer);
  }

  function loadHat(hatID: number): void {
    if (app === undefined || cosmeticsAssets === null) return;
    const hatContainer = new Container();
    hatContainer.position.set(rectPos.x, rectPos.y);

    function loadFaceSprite(texture: Texture): void {
      const sprite = new Sprite(texture);
      sprite.pivot.set(sprite.width / 2, sprite.height / 2);
      sprite.position.set(playerWidth / 2, -playerHeight / 12);
      sprite.scale.set(0.16 / PLAYER_RATIO, (0.16 * 0.75) / PLAYER_RATIO);
      hatContainer.addChild(sprite);
    }

    switch (hatID) {
      case 20:
        loadFaceSprite(cosmeticsAssets.gray_hat);
        break;
      case 21:
        loadFaceSprite(cosmeticsAssets.red_cap);
        break;
      case 22:
        loadFaceSprite(cosmeticsAssets.black_hat);
        break;
      default:
        break;
    }
    app.stage.addChild(hatContainer);
  }

  function loadFace(faceID: number): void {
    if (app === undefined || cosmeticsAssets === null) return;
    const faceContainer = new Container();
    faceContainer.position.set(rectPos.x, rectPos.y);

    function loadFaceSprite(texture: Texture): void {
      const sprite = new Sprite(texture);
      sprite.pivot.set(sprite.width / 2, sprite.height / 2);
      sprite.position.set(playerWidth / 2, playerWidth / 2.5);
      sprite.scale.set(0.134 / PLAYER_RATIO, 0.134 / PLAYER_RATIO);
      faceContainer.addChild(sprite);
    }

    switch (faceID) {
      case 40:
        loadFaceSprite(cosmeticsAssets.black_sunglasses);
        break;
      case 41:
        loadFaceSprite(cosmeticsAssets.pink_sunglasses);
        break;
      case 42:
        loadFaceSprite(cosmeticsAssets.red_eyes);
        break;
      case 43:
        loadFaceSprite(cosmeticsAssets.gray_sunglasses);
        break;
      case 44:
        loadFaceSprite(cosmeticsAssets.gas_mask);
        break;
      case 45:
        loadFaceSprite(cosmeticsAssets.brown_diving_mask);
        break;
      default:
        break;
    }

    app.stage.addChild(faceContainer);
  }

  return <canvas ref={canvasRef} className={"aspect-[2/3] min-h-0"}></canvas>;
}

export { ShopPreview };
