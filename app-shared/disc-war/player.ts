import SAT, { Vector } from "sat";
import { BodyEntity } from "../game/index.js";
import { BoxShape } from "../physics/index.js";
import { Inputs } from "../utils/index.js";

// shape
const WIDTH = 80;
const HEIGHT = 160;

// movement. 0 friction mean full determinism
const FRICTION = 0;
const MAX_SPEED = 1000;
const DASH_SPEED = 2000;
const DASH_DURATION = 200;
const DASH_COOLDOWN = 1000;

class Player extends BodyEntity {
  direction: SAT.Vector;
  canDash: boolean;
  isDashing: boolean;
  dashStart: number;
  dashForce: SAT.Vector;

  constructor(id: string) {
    // default
    const collisionShape = new BoxShape(WIDTH, HEIGHT);
    super(collisionShape, false, id);

    // custom
    this.friction = new SAT.Vector(FRICTION, FRICTION);
    this.direction = new SAT.Vector();
    this.maxSpeed = MAX_SPEED;

    // dash
    this.canDash = true;
    this.isDashing = false;
    this.dashStart = 0;
    this.dashForce = new SAT.Vector();
  }

  processInput(inputs: Record<Inputs, boolean>) {
    if (this.isDashing) return;
    console.log("inputs");
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
    const force = this.direction.clone().scale(MAX_SPEED);
    this.setVelocity(force.x, force.y);

    // apply dash
    if (inputs.dash && this.canDash && false) {
      this.dashStart = 0;
      this.canDash = false;
      this.isDashing = true;
      this.maxSpeed = DASH_SPEED;
      this.dashForce = this.direction.clone().scale(DASH_SPEED);
      this.setVelocity(this.dashForce.x, this.dashForce.y);
    }
  }

  update(dt: number, now: number): void {
    super.update(dt, now);
    if (!this.canDash && false) {
      this.dashStart += 1000 * dt;
      if (this.dashStart < DASH_DURATION) {
        this.setVelocity(this.dashForce.x, this.dashForce.y);
      } else {
        this.isDashing = false;
      }
      if (this.dashStart > DASH_COOLDOWN) {
        this.canDash = true;
        this.maxSpeed = MAX_SPEED;
      }
    }
  }
}

export { Player };
