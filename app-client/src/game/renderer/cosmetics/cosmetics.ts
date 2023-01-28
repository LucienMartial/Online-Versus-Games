import { PlayerRender } from "../player-render";
import { CosmeticAssets } from "../../configs/assets-config";
import { Container } from "pixi.js";

class Cosmetics {
  playerRender: PlayerRender;
  cosmeticsAssets: CosmeticAssets;
  hatContainer: Container;
  faceContainer: Container;
  container: Container;

  constructor(playerRender: PlayerRender, cosmeticsAssets: CosmeticAssets) {
    this.playerRender = playerRender;
    this.cosmeticsAssets = cosmeticsAssets;

    this.container = new Container();
    this.hatContainer = new Container();
    this.faceContainer = new Container();
    this.container.addChild(this.hatContainer);
    this.container.addChild(this.faceContainer);
  }

  loadSkins(skinID: number) {
    switch (skinID) {
      case 0:
        this.playerRender.display.tint = 0xff0000;
        this.playerRender.reflection.tint = 0xff0000;
        break;

      case 1:
        this.playerRender.display.tint = 0x0000ff;
        this.playerRender.reflection.tint = 0x0000ff;
        break;

      case 2:
        this.playerRender.display.tint = 0x00ff00;
        this.playerRender.reflection.tint = 0x00ff00;
        break;

      case 3:
        this.playerRender.display.tint = 0xffff00;
        this.playerRender.reflection.tint = 0xffff00;
        break;

      default:
        break;
    }
  }

  loadHats(hatID: number) {
    this.hatContainer.removeChildren();

    // switch (hatID) {
  }

  loadFaces(faceID: number) {
    this.faceContainer.removeChildren();

    // switch (faceID) {
  }

  // setup position with "offset" method
}

export { Cosmetics };
