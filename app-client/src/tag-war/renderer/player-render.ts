import { BoxShape } from "../../../../app-shared/physics";
import { Player } from "../../../../app-shared/tag-war/player";
import { CosmeticAssets } from "../../game/configs/assets-config";
import { RenderObject } from "../../game/renderer";
import { Cosmetics } from "../../game/renderer/cosmetics/cosmetics";
import { PlayerCursor } from "../../game/renderer/player-cursor";
import { Graphics } from "../../game/utils/graphics";
import * as PIXI from "pixi.js";

class PlayerRender extends RenderObject {
  player: Player;
  cosmetics: Cosmetics;
  display: PIXI.Graphics;
  cursor?: PlayerCursor;

  constructor(
    player: Player,
    id: string,
    cosmeticsAssets: CosmeticAssets,
    isMain = false,
  ) {
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

    // cursor
    if (isMain) {
      const cursorWidth = 10;
      const cursorHeight = 30;
      this.cursor = new PlayerCursor();
      this.cursor.setOffset(
        -player.offset.x * 1.1 + cursorWidth / 2,
        player.offset.y * 2 - cursorHeight / 2,
      );
      this.cursor.container.zIndex = 20;
      this.add(this.cursor);
    }

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
      this.display.tint = 0xff0000;
    } else {
      this.display.tint = 0x0000ff;
    }
  }
}

export { PlayerRender };
