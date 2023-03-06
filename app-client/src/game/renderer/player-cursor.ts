import { Graphics } from "../utils";
import { RenderObject } from "./render-object";

class PlayerCursor extends RenderObject {
  constructor() {
    super();
    const width = 10;
    const height = 30;
    const left = Graphics.createRectangle(
      width,
      height,
      0xffffff,
    );
    left.pivot.set(width / 2, height / 2);
    left.rotation = -Math.PI / 4;
    left.position.x += -width + width / 2 - 2.5;
    const right = Graphics.createRectangle(
      width,
      height,
      0xffffff,
    );
    right.pivot.set(width / 2, height / 2);
    right.rotation = Math.PI / 4;
    right.position.x += width - width / 2 + 2.5;
    this.addChild(left);
    this.addChild(right);
  }

  update(dt: number, now: number) {
    this.position.y = Math.cos(now * 0.005) * 3;
  }
}

export { PlayerCursor };