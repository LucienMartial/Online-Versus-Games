import { useRef, useEffect, useState, useMemo } from "react";
import { WIDTH, HEIGHT } from "../../../../../app-shared/disc-war/player";
import { SelectedItems } from "../../../../../app-shared/types";
import { Application, Graphics, Sprite, Container } from "pixi.js";
import { CosmeticAssets } from "../../../game/configs/assets-config";
import { DEFAULT_SKIN } from "../../../../../app-shared/configs/shop-config";

interface Position {
  x: number;
  y: number;
}

interface ShopPreviewProps {
  width: number;
  height: number;
  selectedItems: SelectedItems | null;
  cosmeticsAssets: CosmeticAssets | null;
}

function ShopPreview({
  width,
  height,
  selectedItems,
  cosmeticsAssets,
}: ShopPreviewProps) {
  const [app, setApp] = useState<Application>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rectPos, setRectPos] = useState<Position>({
    x: width / 2 - WIDTH / 2,
    y: height / 2 - HEIGHT / 3,
  });

  useEffect(() => {
    const application = new Application({
      width,
      height,
      backgroundAlpha: 0,
      autoDensity: true,
      view: canvasRef.current === null ? undefined : canvasRef.current,
    });
    setApp(application);
  }, []);

  useEffect(() => {
    if (cosmeticsAssets) {
      loadCharacter();
    }
  }, [cosmeticsAssets, selectedItems]);

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
    skin.drawRect(rectPos.x, rectPos.y, WIDTH, HEIGHT);
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
        sprite20.scale.set(0.035, 0.035);
        sprite20.position.set(WIDTH / 2, -HEIGHT / 10);
        hatContainer.addChild(sprite20);
        break;
      case 21:
        const sprite21 = new Sprite(cosmeticsAssets?.blue_cap);
        sprite21.pivot.set(sprite21.width / 2, sprite21.height / 2);
        sprite21.scale.set(0.1, 0.1);
        sprite21.position.set(WIDTH / 2 - WIDTH / 8, -HEIGHT / 20);
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
        sprite40.scale.set(0.02, 0.02);
        sprite40.position.set(WIDTH / 2, HEIGHT / 4);
        faceContainer.addChild(sprite40);
        break;
      case 41:
        const sprite41 = new Sprite(cosmeticsAssets?.pink_sunglasses);
        sprite41.pivot.set(sprite41.width / 2, sprite41.height / 2);
        sprite41.scale.set(0.1, 0.1);
        sprite41.position.set(WIDTH / 2, HEIGHT / 4);
        faceContainer.addChild(sprite41);
        break;
      case 42:
        const eye1 = new Sprite(cosmeticsAssets?.red_eye);
        const eye2 = new Sprite(cosmeticsAssets?.red_eye);
        eye1.pivot.set(eye1.width / 2, eye1.height / 2);
        eye2.pivot.set(eye2.width / 2, eye2.height / 2);
        eye1.scale.set(0.1, 0.1);
        eye2.scale.set(0.1, 0.1);
        eye1.position.set(WIDTH / 2 - WIDTH / 4, HEIGHT / 4);
        eye2.position.set(WIDTH / 2 + WIDTH / 4, HEIGHT / 4);
        faceContainer.addChild(eye1);
        faceContainer.addChild(eye2);
        break;
      default:
        break;
    }

    app.stage.addChild(faceContainer);
  }

  return (
    <canvas
      className={"border-2 border-gray-400"}
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
}

export { ShopPreview };
