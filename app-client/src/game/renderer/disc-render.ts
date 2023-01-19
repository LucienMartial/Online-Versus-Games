import * as PIXI from "pixi.js";
import { Disc } from "../../../../app-shared/disc-war";
import { CircleShape } from "../../../../app-shared/physics";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

const COLOR = 0x00ffdd;

class DiscRender extends RenderObject {
  disc: Disc;
  display: PIXI.Graphics;
  mirror: PIXI.DisplayObject;
  shockwave: PIXI.Filter;

  constructor(disc: Disc, shockwave: PIXI.Filter) {
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

    // shockwave
    this.shockwave = shockwave;
    disc.onWallCollision = (posX: number, posY: number) => {
      this.shockwave.uniforms.center = [posX, posY];
      this.shockwave.uniforms.time = 0;
    };
  }

  update(dt: number, now: number) {
    super.update(dt, now);
    this.position.set(this.disc.position.x, this.disc.position.y);
    this.mirror.position = this.position.clone();

    if (this.shockwave.uniforms.time >= 2.5) {
      this.shockwave.uniforms.time = 2.5;
    }

    if (!this.disc.attachedPlayer) return;
    if (this.disc.isAttached || this.disc.attachedPlayer.friendlyDisc) {
      this.display.tint = 0x00dd88;
    } else {
      this.display.tint = 0xffffff;
    }
  }
}

export { DiscRender };
