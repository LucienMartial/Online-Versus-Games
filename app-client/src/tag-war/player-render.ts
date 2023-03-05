import { BoxShape } from "../../../app-shared/physics";
import { Player } from "../../../app-shared/tag-war/player";
import { CosmeticAssets } from "../game/configs/assets-config";
import { RenderObject } from "../game/renderer";
import { Cosmetics } from "../game/renderer/cosmetics/cosmetics";
import { Graphics } from "../game/utils/graphics";
import * as PIXI from "pixi.js";

class PlayerRender extends RenderObject {
  player: Player;
  cosmetics: Cosmetics;
  display: PIXI.Graphics;

  constructor(player: Player, id: string, cosmeticsAssets: CosmeticAssets) {
    super(id);
    this.player = player;

    // display
    const shape = player.collisionShape as BoxShape;
    this.display = Graphics.createRectangle(
      shape.width,
      shape.height,
      0xffffff,
    );
    this.setOffset(player.offset.x, player.offset.y);
    this.addChild(this.display);

    // cosmetics
    this.cosmetics = new Cosmetics(this, cosmeticsAssets);
    this.cosmetics.loadCosmetics(player.cosmetics);
    this.cosmetics.container.zIndex = 1;
    this.addChild(this.cosmetics.container);
  }

  update(dt: number, now: number) {
    super.update(dt, now);
    this.position.set(this.player.position.x, this.player.position.y);

    if (this.player.isThief) {
      this.display.tint = 0x0000ff;
    } else {
      this.display.tint = 0xff0000;
    }
  }
}

export { PlayerRender };
