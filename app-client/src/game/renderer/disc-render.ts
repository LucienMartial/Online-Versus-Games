import * as PIXI from "pixi.js";
import { Vector } from "sat";
import { Disc } from "../../../../app-shared/disc-war";
import { CircleShape } from "../../../../app-shared/physics";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

const COLOR = 0x00ffdd;

class DiscRender extends RenderObject {
  disc: Disc;
  display: PIXI.Graphics;
  mirror: PIXI.DisplayObject;

  constructor(disc: Disc) {
    super();

    this.container.sortableChildren = true;
    const shape = disc.collisionShape as CircleShape;
    this.display = Graphics.createHollowCircle(shape.radius, 16, COLOR);
    this.addChild(this.display);

    // custom
    this.disc = disc;
    this.setOffset(disc.offset.x, disc.offset.y);

    // wall collision
    // this.disc.onWallCallback = (position: Vector) => {
    //   console.log("collision with walls", position);
    // };

    // reflection
    this.mirror = Graphics.createMirror(
      this.display,
      shape.radius * 1.5,
      false
    );
    this.mirror.position = this.position.clone();
  }

  update(dt: number, now: number) {
    super.update(dt, now);
    this.position.set(this.disc.position.x, this.disc.position.y);
    this.mirror.position = this.position.clone();

    if (!this.disc.attachedPlayer) return;
    if (this.disc.isAttached || this.disc.attachedPlayer.friendlyDisc) {
      this.display.tint = 0x00dd88;
    } else {
      this.display.tint = 0xffffff;
    }
  }
}

export { DiscRender };
