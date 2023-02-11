import { PlayerRender } from "../player-render";
import { CosmeticAssets } from "../../configs/assets-config";
import { Container, Sprite, Texture } from "pixi.js";
import {
  WIDTH,
  HEIGHT,
  PLAYER_RATIO,
} from "../../../../../app-shared/disc-war";
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
    this.loadFaces(cosmetics.faceID);
    this.loadHats(cosmetics.hatID);
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

    function loadHatSprite(texture: Texture): Sprite {
      const sprite = new Sprite(texture);
      sprite.pivot.set(sprite.width / 2, sprite.height / 2);
      sprite.position.set(WIDTH / 2, -HEIGHT / 24);
      sprite.scale.set(0.07 / PLAYER_RATIO, (0.07 * 0.8) / PLAYER_RATIO);
      return sprite;
    }

    let sprite: Sprite | null = null;

    switch (hatID) {
      case 20:
        sprite = loadHatSprite(this.cosmeticsAssets.gray_hat);
        break;
      case 21:
        sprite = loadHatSprite(this.cosmeticsAssets.red_cap);
        break;
      case 22:
        sprite = loadHatSprite(this.cosmeticsAssets.black_hat);
        break;
      default:
        break;
    }

    if (sprite) {
      this.hatContainer.addChild(sprite);
      this.addTextureReflection(sprite, this.hatReflection);
    }
  }

  loadFaces(faceID: number) {
    this.faceContainer.removeChildren();

    function loadFaceSprite(texture: Texture): Sprite {
      const sprite = new Sprite(texture);
      sprite.pivot.set(sprite.width / 2, sprite.height / 2);
      sprite.position.set(WIDTH / 2, HEIGHT / 4.5);
      sprite.scale.set(0.065 / PLAYER_RATIO, 0.065 / PLAYER_RATIO);
      return sprite;
    }

    let sprite: Sprite | null = null;

    switch (faceID) {
      case 40:
        sprite = loadFaceSprite(this.cosmeticsAssets.black_sunglasses);
        break;
      case 41:
        sprite = loadFaceSprite(this.cosmeticsAssets.pink_sunglasses);
        break;
      case 42:
        sprite = loadFaceSprite(this.cosmeticsAssets.red_eyes);
        break;
      case 43:
        sprite = loadFaceSprite(this.cosmeticsAssets.gray_sunglasses);
        break;
      case 44:
        sprite = loadFaceSprite(this.cosmeticsAssets.gas_mask);
        break;
      case 45:
        sprite = loadFaceSprite(this.cosmeticsAssets.brown_diving_mask);
        break;
      default:
        break;
    }

    if (sprite) {
      this.faceContainer.addChild(sprite);
      this.addTextureReflection(sprite, this.faceReflection);
    }
  }
}

export { Cosmetics };
