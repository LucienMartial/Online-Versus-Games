import { Player } from "../../../../app-shared/disc-war";
import { BodyEntity } from "../../../../app-shared/game";
import { BoxShape } from "../../../../app-shared/physics";
import { lerp } from "../../../../app-shared/utils";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

class DiscRender extends RenderObject {
  disc: BodyEntity;

  constructor(disc: BodyEntity) {
    super();

    const shape = disc.collisionShape as BoxShape;
    const display = Graphics.createRectangle(
      shape.width,
      shape.height,
      0x00ffdd
    );
    this.addChild(display);

    // custom
    this.disc = disc;
    this.setOffset(disc.offset.x, disc.offset.y);
  }

  update(dt: number, now: number) {
    const lerpPower = 0.98;
    this.position.x = lerp(this.position.x, this.disc.position.x, lerpPower);
    this.position.y = lerp(this.position.y, this.disc.position.y, lerpPower);
  }
}

export { DiscRender };
