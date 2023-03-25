import { BoxShape } from "../../../../app-shared/physics";
import { Player } from "../../../../app-shared/tag-war/player";
import { CosmeticAssets } from "../../game/configs/assets-config";
import { RenderObject } from "../../game/renderer";
import { Cosmetics } from "../../game/renderer/cosmetics/cosmetics";
import { PlayerCursor } from "../../game/renderer/player-cursor";
import { Graphics } from "../../game/utils/graphics";
import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { DeathAnimManager } from "../../disc-war/effects/death-anim-manager";

class PlayerRender extends RenderObject {
  player: Player;
  cosmetics: Cosmetics;
  deathAnim: DeathAnimManager;
  display: PIXI.Graphics;
  cursor?: PlayerCursor;
  shape: BoxShape;

  constructor(
    player: Player,
    id: string,
    cosmeticsAssets: CosmeticAssets,
    deathAnim: DeathAnimManager,
    isMain = false,
    stage: Container | undefined = undefined,
  ) {
    super(id);
    this.player = player;

    // display
    this.shape = player.collisionShape as BoxShape;
    this.display = Graphics.createRectangle(
      this.shape.width,
      this.shape.height,
      0xffffff,
    );
    this.setOffset(player.offset.x, player.offset.y);
    this.addChild(this.display);

    // cursor
    if (isMain && stage) {
      const cursorWidth = 10;
      const cursorHeight = 30;
      this.cursor = new PlayerCursor(
        -player.offset.x * 1.1 + cursorWidth / 2,
        player.offset.y * 2 - cursorHeight / 2,
      );
      this.cursor.container.zIndex = 50;
      stage?.addChild(this.cursor.container);
    }

    // cosmetics
    this.cosmetics = new Cosmetics(this, cosmeticsAssets);
    this.cosmetics.loadCosmetics(player.cosmetics);
    this.cosmetics.container.zIndex = 1;
    this.addChild(this.cosmetics.container);

    // role color
    this.setRoleColor();

    // on death
    this.deathAnim = deathAnim;
    this.player.onDeath = (
      posX: number,
      posY: number,
    ) => {
      this.display.tint = 0xffffff;
      this.deathAnim.newDeathAnim(posX, posY);
    };
  }

  setRoleColor() {
    if (this.player.isThief) this.display.tint = 0xff0000;
    else this.display.tint = 0x0000ff;
  }

  update(dt: number, now: number) {
    super.update(dt, now);

    this.cursor?.setPosition(
      this.player.position.x - this.player.offset.x,
      this.player.position.y - this.player.offset.y,
    );
    this.cursor?.update(dt, now);

    if (!this.player.collisionWithOther && !this.player.isDead) {
      this.setRoleColor();
    } else {
      // fake 3D, show player behind and in front based on y pos
      if (
        this.player.position.y > this.player.otherPosY
      ) {
        this.container.zIndex = 10;
      } else {
        this.container.zIndex = 8;
      }
      if (this.player.isThief) {
        this.display.tint = 0xffffff;
      }
    }
    this.position.set(this.player.position.x, this.player.position.y);
  }
}

export { PlayerRender };
