import { BodyEntity } from "../../../../app-shared/game";
import { BoxShape } from "../../../../app-shared/physics";
import { lerp } from "../../../../app-shared/utils";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

const COLOR = 0x00ffdd;

class DiscRender extends RenderObject {
  disc: BodyEntity;

  constructor(disc: BodyEntity) {
    super();

    const shape = disc.collisionShape as BoxShape;
    const display = Graphics.createRectangle(shape.width, shape.height, COLOR);
    this.addChild(display);

    // custom
    this.disc = disc;
    this.setOffset(disc.offset.x, disc.offset.y);
  }

  update(dt: number, now: number) {
    this.position.set(this.disc.position.x, this.disc.position.y);
  }
}

export { DiscRender };
