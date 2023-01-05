import { Graphics } from "./utils/graphics";
import { BoxShape } from "../../../app-shared/physics";
import { Context } from "./scene";
import { BodyEntity } from "./entities";
import { Vector } from "sat";
import { Inputs } from "./utils/input";

// shape
const WIDTH = 80;
const HEIGHT = 160;

// movement
const ACCELERATION = 100;
const MAX_SPEED = 800;
const DASH_SPEED = 800;
const FRICTION = 0.95;

class Player extends BodyEntity {
  direction: Vector;

  constructor(context: Context) {
    // default
    const renderObject = Graphics.createRectangle(WIDTH, HEIGHT);
    const collisionShape = new BoxShape(WIDTH, HEIGHT);
    super(context, renderObject, collisionShape, false);

    // custom
    this.physicObject.friction = new Vector(FRICTION, FRICTION);
    this.direction = new Vector(0, 0);
  }

  processInput(inputs: Record<Inputs, boolean>): void {
    this.direction = new Vector();

    // get direction
    if (inputs.left) this.direction.x = -1;
    else if (inputs.right) this.direction.x = 1;
    if (inputs.up) this.direction.y = -1;
    else if (inputs.down) this.direction.y = 1;

    // do not continue if there is no movement
    if (!(this.direction.len() > 0)) return;
    this.direction.normalize();

    // move
    const acc = this.direction.clone().scale(ACCELERATION);
    this.accelerate(acc.x, acc.y);

    // move max speed
    const factorX = MAX_SPEED / Math.abs(this.physicObject.velocity.x);
    const factorY = MAX_SPEED / Math.abs(this.physicObject.velocity.y);
    if (factorX < 1) this.physicObject.velocity.x *= factorX;
    if (factorY < 1) this.physicObject.velocity.y *= factorY;

    // apply dash
    if (inputs.dash) {
      const dashForce = this.direction.clone().scale(DASH_SPEED);
      this.accelerate(dashForce.x, dashForce.y);
    }
  }
}

export { Player };
