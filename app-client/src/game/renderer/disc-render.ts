import * as PIXI from "pixi.js";
import { Disc } from "../../../../app-shared/disc-war";
import { CircleShape } from "../../../../app-shared/physics";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";
import { Viewport } from "pixi-viewport";
import { ShockwaveManager } from "../effects/shockwave-manager";
import { convertToList } from "@pixi/assets";

const COLOR = 0x00ffdd;
const MAX_TIME_SHOCKWAVE = 2.5;

class DiscRender extends RenderObject {
  disc: Disc;
  display: PIXI.Graphics;
  mirror: PIXI.DisplayObject;
  viewports: Viewport;
  shockwaves: ShockwaveManager;

  constructor(disc: Disc, shockwaves: ShockwaveManager, viewports: Viewport) {
    super();

    this.container.sortableChildren = true;
    const shape = disc.collisionShape as CircleShape;
    this.display = Graphics.createHollowCircle(shape.radius, 16, COLOR);
    this.addChild(this.display);

    // custom
    this.disc = disc;
    this.setOffset(disc.offset.x, disc.offset.y);

    // reflection
    this.mirror = Graphics.createMirror(
      this.display,
      shape.radius * 1.5,
      false
    );
    this.mirror.position = this.position.clone();

    // viewports
    this.viewports = viewports;

    // shockwave
    this.shockwaves = shockwaves;
    disc.onWallCollision = (posX: number, posY: number) => {
      // const translatedPos = this.viewports.toScreen(posX, posY);
      // this.shockwaves.newShockwave(translatedPos.x, translatedPos.y);
    };
  }

  update(dt: number, now: number) {
    super.update(dt, now);
    this.position.set(this.disc.position.x, this.disc.position.y);
    this.mirror.position = this.position.clone();

    this.shockwaves.update(dt);

    if (!this.disc.attachedPlayer) return;
    if (this.disc.isAttached || this.disc.attachedPlayer.friendlyDisc) {
      this.display.tint = 0x00dd88;
    } else {
      this.display.tint = 0xffffff;
    }
  }
}

export { DiscRender };
