import SAT from "sat";
import { BodyEntity } from "../game/index.js";
import { BoxShape } from "../physics/index.js";
import { Inputs } from "../utils/index.js";

// shape
const WIDTH = 80;
const HEIGHT = 160;

// movement
const ACCELERATION = 100;
const MAX_SPEED = 800;
const DASH_SPEED = 800;
const FRICTION = 0.95;

class Player extends BodyEntity {
  direction: SAT.Vector;

  constructor(id: string) {
    // default
    const collisionShape = new BoxShape(WIDTH, HEIGHT);
    super(collisionShape, false, id);

    // custom
    this.friction = new SAT.Vector(FRICTION, FRICTION);
    this.direction = new SAT.Vector();
  }

  processInput(inputs: Record<Inputs, boolean>) {
    this.direction = new SAT.Vector();

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
    const factorX = MAX_SPEED / Math.abs(this.velocity.x);
    const factorY = MAX_SPEED / Math.abs(this.velocity.y);
    if (factorX < 1) this.velocity.x *= factorX;
    if (factorY < 1) this.velocity.y *= factorY;

    // apply dash
    if (inputs.dash) {
      const dashForce = this.direction.clone().scale(DASH_SPEED);
      this.accelerate(dashForce.x, dashForce.y);
    }
  }
}

export { Player };
