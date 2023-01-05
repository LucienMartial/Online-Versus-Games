import { Graphics } from "./utils/graphics";
import { BoxShape } from "../../../app-shared/physics";
import { Context } from "./scene";
import { BodyEntity } from "./entities";

const SPEED: number = 80;
const DASH_SPEED: number = 500;

class Player extends BodyEntity {
  constructor(context: Context) {
    super(
      context,
      Graphics.createRectangle(100, 200),
      new BoxShape(100, 200),
      false
    );
  }

  processInput(inputs: { [key: string]: boolean }): void {
    const dash: number = inputs.space ? DASH_SPEED : 0;

    if (inputs.left) this.accelerate(-SPEED - dash, 0);
    else if (inputs.right) this.accelerate(SPEED + dash, 0);
    if (inputs.up) this.accelerate(0, -SPEED - dash);
    else if (inputs.down) this.accelerate(0, SPEED + dash);
  }
}

export { Player };
