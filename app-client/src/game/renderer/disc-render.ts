import { Container, DisplayObject } from "pixi.js";
import { BodyEntity } from "../../../../app-shared/game";
import { CircleShape } from "../../../../app-shared/physics";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

const COLOR = 0x00ffdd;

class DiscRender extends RenderObject {
  disc: BodyEntity;
  mirror: DisplayObject;

  constructor(disc: BodyEntity) {
    super();

    this.container.sortableChildren = true;
    const shape = disc.collisionShape as CircleShape;
    const display = Graphics.createCircle(shape.radius, COLOR);
    this.addChild(display);

    // custom
    this.disc = disc;
    this.setOffset(disc.offset.x, disc.offset.y);

    // reflection
    this.mirror = Graphics.createMirror(display, shape.radius * 1.5, false);
    this.mirror.position = this.position.clone();
  }

  update(dt: number, now: number) {
    super.update(dt, now);
    this.position.set(this.disc.position.x, this.disc.position.y);
    this.mirror.position = this.position.clone();
  }
}

export { DiscRender };
