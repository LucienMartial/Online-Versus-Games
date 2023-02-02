import { PlayerRender } from "../player-render";
import { CosmeticAssets } from "../../configs/assets-config";
import { Container, Sprite } from "pixi.js";
import { WIDTH, HEIGHT } from "../../../../../app-shared/disc-war";
import { SelectedItems } from "../../../../../app-shared/types";

class Cosmetics {
  playerRender: PlayerRender;
  cosmeticsAssets: CosmeticAssets;
  hatContainer: Container;
  hatReflection: Container;
  faceContainer: Container;
  faceReflection: Container;
  container: Container;
  reflection: Container;

  constructor(playerRender: PlayerRender, cosmeticsAssets: CosmeticAssets) {
    this.playerRender = playerRender;
    this.cosmeticsAssets = cosmeticsAssets;

    this.container = new Container();
    this.hatContainer = new Container();
    this.faceContainer = new Container();
    this.container.addChild(this.hatContainer);
    this.container.addChild(this.faceContainer);

    this.reflection = new Container();
    this.faceReflection = new Container();
    this.hatReflection = new Container();
    this.reflection.addChild(this.hatReflection);
    this.reflection.addChild(this.faceReflection);
  }

  loadCosmetics(cosmetics: SelectedItems) {
    this.loadSkins(cosmetics.skinID);
    this.loadHats(cosmetics.hatID);
    this.loadFaces(cosmetics.faceID);
  }

  loadSkins(skinID: number) {
    switch (skinID) {
      case 0:
        this.playerRender.display.tint = 0x990000;
        this.playerRender.reflection.tint = 0x990000;
        break;

      case 1:
        this.playerRender.display.tint = 0x000099;
        this.playerRender.reflection.tint = 0x000099;
        break;

      case 2:
        this.playerRender.display.tint = 0x009900;
        this.playerRender.reflection.tint = 0x009900;
        break;

      case 3:
        this.playerRender.display.tint = 0x999900;
        this.playerRender.reflection.tint = 0x999900;
        break;

      default:
        break;
    }
  }

  loadHats(hatID: number) {
    this.hatContainer.removeChildren();

    switch (hatID) {
      case 20:
        const sprite20 = new Sprite(this.cosmeticsAssets.melon_hat);
        this.hatContainer.pivot.set(sprite20.width / 2, sprite20.height / 2);
        this.hatContainer.scale.set(0.035, 0.035);
        this.hatContainer.position.set(WIDTH / 2, -HEIGHT / 10);
        this.hatContainer.addChild(sprite20);
        break;
      case 21:
        const sprite21 = new Sprite(this.cosmeticsAssets.blue_cap);
        this.hatContainer.pivot.set(sprite21.width / 2, sprite21.height / 2);
        this.hatContainer.scale.set(0.1, 0.1);
        this.hatContainer.position.set(WIDTH / 2 - WIDTH / 8, -HEIGHT / 20);
        this.hatContainer.addChild(sprite21);
        break;
      default:
        break;
    }
  }

  loadFaces(faceID: number) {
    this.faceContainer.removeChildren();

    switch (faceID) {
      case 40:
        const sprite40 = new Sprite(this.cosmeticsAssets.black_sunglasses);
        this.faceContainer.pivot.set(sprite40.width / 2, sprite40.height / 2);
        this.faceContainer.scale.set(0.02, 0.02);
        this.faceContainer.position.set(WIDTH / 2, HEIGHT / 4);
        this.faceContainer.addChild(sprite40);
        break;

      case 41:
        const sprite41 = new Sprite(this.cosmeticsAssets.pink_sunglasses);
        this.faceContainer.pivot.set(sprite41.width / 2, sprite41.height / 2);
        this.faceContainer.scale.set(0.1, 0.1);
        this.faceContainer.position.set(WIDTH / 2, HEIGHT / 4);
        this.faceContainer.addChild(sprite41);
        break;
      case 42:
        const eye1 = new Sprite(this.cosmeticsAssets.default_eye);
        const eye2 = new Sprite(this.cosmeticsAssets.default_eye);
        eye1.pivot.set(eye1.width / 2, eye1.height / 2);
        eye2.pivot.set(eye2.width / 2, eye2.height / 2);
        eye1.scale.set(0.1, 0.1);
        eye2.scale.set(0.1, 0.1);
        eye1.position.set(WIDTH / 2 - WIDTH / 4, HEIGHT / 4);
        eye2.position.set(WIDTH / 2 + WIDTH / 4, HEIGHT / 4);
        this.faceContainer.addChild(eye1);
        this.faceContainer.addChild(eye2);
        break;
      default:
        break;
    }
  }

  // setup position with "offset" method
}

export { Cosmetics };
