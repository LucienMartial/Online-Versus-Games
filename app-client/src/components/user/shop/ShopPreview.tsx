import { useRef, useEffect, useState } from "react";
import { PLAYER_RATIO } from "../../../../../app-shared/disc-war/player";
import { SelectedItems } from "../../../../../app-shared/types";
import { Application, Graphics, Sprite, Container, Loader } from "pixi.js";
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
      console.log("app", app);
      loadCharacter();
    }
  }, [app, cosmeticsAssets, selectedItems, canvWidth, canHeight]);

  function loadCharacter() {
    if (app === undefined || selectedItems === null) return;
    app.stage.removeChildren();
    loadSkin(selectedItems.skinID);
    loadHat(selectedItems.hatID);
    loadFace(selectedItems.faceID);
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
    if (app === undefined) return;
    const hatContainer = new Container();
    hatContainer.position.set(rectPos.x, rectPos.y);
    switch (hatID) {
      case 20:
        const sprite20 = new Sprite(cosmeticsAssets?.melon_hat);
        sprite20.pivot.set(sprite20.width / 2, sprite20.height / 2);
        sprite20.position.set(playerWidth / 2, -playerHeight / 14);
        sprite20.scale.set(0.035 / PLAYER_RATIO, 0.035 / PLAYER_RATIO);
        hatContainer.addChild(sprite20);
        break;
      case 21:
        const sprite21 = new Sprite(cosmeticsAssets?.blue_cap);
        sprite21.pivot.set(sprite21.width / 2, sprite21.height / 2);
        sprite21.position.set(
          playerWidth / 2 - playerWidth / 8,
          -playerHeight / 20
        );
        sprite21.scale.set(0.1 / PLAYER_RATIO, 0.1 / PLAYER_RATIO);
        hatContainer.addChild(sprite21);
        break;
      default:
        break;
    }

    app.stage.addChild(hatContainer);
  }

  function loadFace(faceID: number): void {
    if (app === undefined) return;
    const faceContainer = new Container();
    faceContainer.position.set(rectPos.x, rectPos.y);
    switch (faceID) {
      case 40:
        const sprite40 = new Sprite(cosmeticsAssets?.black_sunglasses);
        sprite40.pivot.set(sprite40.width / 2, sprite40.height / 2);
        sprite40.position.set(playerWidth / 2, playerHeight / 4.5);
        sprite40.scale.set(0.022 / PLAYER_RATIO, 0.022 / PLAYER_RATIO);
        faceContainer.addChild(sprite40);
        break;
      case 41:
        const sprite41 = new Sprite(cosmeticsAssets?.pink_sunglasses);
        sprite41.pivot.set(sprite41.width / 2, sprite41.height / 2);
        sprite41.position.set(playerWidth / 2, playerWidth / 2.5);
        sprite41.scale.set(0.11 / PLAYER_RATIO, 0.11 / PLAYER_RATIO);
        faceContainer.addChild(sprite41);
        break;
      case 42:
        const eye1 = new Sprite(cosmeticsAssets?.red_eye);
        const eye2 = new Sprite(cosmeticsAssets?.red_eye);
        eye1.pivot.set(eye1.width / 2, eye1.height / 2);
        eye2.pivot.set(eye2.width / 2, eye2.height / 2);
        eye1.position.set(playerWidth / 2 - playerWidth / 4, playerHeight / 4);
        eye2.position.set(playerWidth / 2 + playerWidth / 4, playerHeight / 4);
        eye1.scale.set(0.12 / PLAYER_RATIO, 0.12 / PLAYER_RATIO);
        eye2.scale.set(0.12 / PLAYER_RATIO, 0.12 / PLAYER_RATIO);
        faceContainer.addChild(eye1);
        faceContainer.addChild(eye2);
        break;
      default:
        break;
    }

    app.stage.addChild(faceContainer);
  }

  return <canvas ref={canvasRef} className={"aspect-[2/3] my-10"}></canvas>;
}

export { ShopPreview };
