import { BodyEntity } from "../../../../app-shared/game";
import { BoxShape } from "../../../../app-shared/physics";
import { lerp } from "../../../../app-shared/utils";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

const POS_LERP = 0.98;
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
    const lerpPower = 0.98;
    this.position.x = lerp(this.position.x, this.disc.position.x, POS_LERP);
    this.position.y = lerp(this.position.y, this.disc.position.y, POS_LERP);
  }
}

export { DiscRender };
