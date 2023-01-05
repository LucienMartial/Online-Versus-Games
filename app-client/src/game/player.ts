import { Graphics } from "./utils/graphics";
import { BoxShape } from "../../../app-shared/physics";
import { Context } from "./scene";
import { BodyEntity } from "./entities";
import { Vector } from "sat";

// shape
const WIDTH = 80;
const HEIGHT = 160;

// movement
const SPEED = 15;
const ACCELERATION = 40;
const DASH_SPEED = 200;
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

  processInput(inputs: { [key: string]: boolean }): void {
    this.direction = new Vector();

    // get direction
    if (inputs.left) this.direction.x = -1;
    else if (inputs.right) this.direction.x = 1;
    if (inputs.up) this.direction.y = -1;
    else if (inputs.down) this.direction.y = 1;

    if (!(this.direction.len() > 0)) return;
    this.direction.normalize();

    // move
    const move = this.direction.clone().scale(SPEED);
    const acc = this.direction.clone().scale(ACCELERATION);
    this.move(move.x, move.y);
    this.accelerate(acc.x, acc.y);

    // apply dash
    if (inputs.space) {
      const dashForce = this.direction.clone().scale(DASH_SPEED);
      this.accelerate(dashForce.x, dashForce.y);
    }
  }
}

export { Player };
