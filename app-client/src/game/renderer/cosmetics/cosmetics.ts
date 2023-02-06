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
    console.log("LOAD cosmetics", cosmetics);
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

  addTextureReflection(sprite: Sprite, container: Container) {
    const spriteReflection = new Sprite(sprite.texture);
    sprite.pivot.copyTo(spriteReflection.pivot);
    sprite.scale.copyTo(spriteReflection.scale);
    sprite.position.copyTo(spriteReflection.position);
    container.addChild(spriteReflection);
  }

  loadHats(hatID: number) {
    this.hatContainer.removeChildren();

    switch (hatID) {
      case 20:
        const sprite20 = new Sprite(this.cosmeticsAssets.melon_hat);
        sprite20.pivot.set(sprite20.width / 2, sprite20.height / 2);
        sprite20.scale.set(0.035, 0.035);
        sprite20.position.set(WIDTH / 2, -HEIGHT / 10);
        this.hatContainer.addChild(sprite20);
        this.addTextureReflection(sprite20, this.hatReflection);
        break;
      case 21:
        const sprite21 = new Sprite(this.cosmeticsAssets.blue_cap);
        sprite21.pivot.set(sprite21.width / 2, sprite21.height / 2);
        sprite21.scale.set(0.1, 0.1);
        sprite21.position.set(WIDTH / 2 - WIDTH / 8, -HEIGHT / 20);
        this.hatContainer.addChild(sprite21);
        this.addTextureReflection(sprite21, this.hatReflection);
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
        sprite40.pivot.set(sprite40.width / 2, sprite40.height / 2);
        sprite40.scale.set(0.02, 0.02);
        sprite40.position.set(WIDTH / 2, HEIGHT / 4);
        this.faceContainer.addChild(sprite40);
        this.addTextureReflection(sprite40, this.faceReflection);
        break;
      case 41:
        const sprite41 = new Sprite(this.cosmeticsAssets.pink_sunglasses);
        sprite41.pivot.set(sprite41.width / 2, sprite41.height / 2);
        sprite41.scale.set(0.1, 0.1);
        sprite41.position.set(WIDTH / 2, HEIGHT / 4);
        this.faceContainer.addChild(sprite41);
        this.addTextureReflection(sprite41, this.faceReflection);
        break;
      case 42:
        const eye1 = new Sprite(this.cosmeticsAssets.red_eye);
        const eye2 = new Sprite(this.cosmeticsAssets.red_eye);
        eye1.pivot.set(eye1.width / 2, eye1.height / 2);
        eye2.pivot.set(eye2.width / 2, eye2.height / 2);
        eye1.scale.set(0.1, 0.1);
        eye2.scale.set(0.1, 0.1);
        eye1.position.set(WIDTH / 2 - WIDTH / 4, HEIGHT / 4);
        eye2.position.set(WIDTH / 2 + WIDTH / 4, HEIGHT / 4);
        this.addTextureReflection(eye1, this.faceReflection);
        this.addTextureReflection(eye2, this.faceReflection);
        this.faceContainer.addChild(eye1);
        this.faceContainer.addChild(eye2);

        break;
      default:
        break;
    }
  }
}

export { Cosmetics };
