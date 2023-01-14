import SAT from "sat";
import { BodyEntity } from "../game/index.js";
import { BoxShape } from "../physics/index.js";
import { PlayerState } from "../state/index.js";
import { Inputs, SyncTimer } from "../utils/index.js";
import { Disc } from "./index.js";

// shape
const WIDTH = 80;
const HEIGHT = 160;

// movement. 0 friction mean full determinism
const FRICTION = 0;
const MAX_SPEED = 800;
const DASH_SPEED = 2200;

// 1 second = 60 ticks
const DASH_DURATION = 0.2 * 60;
const DASH_COOLDOWN = 0.8 * 60;

class Player extends BodyEntity {
  private isPuppet: boolean;
  disc: Disc;
  direction: SAT.Vector;
  dashForce: SAT.Vector;
  deadCallback: Function;
  isLeft: boolean;
  dashTimer: SyncTimer;
  dashCooldownTimer: SyncTimer;
  possesDisc: boolean;

  constructor(
    id: string,
    isPuppet: boolean,
    deadCallback: Function,
    disc: Disc
  ) {
    // default
    const collisionShape = new BoxShape(WIDTH, HEIGHT);
    super(collisionShape, false, id);
    this.setOffset(WIDTH / 2, HEIGHT / 2);

    // custom
    this.disc = disc;
    this.isPuppet = isPuppet;
    this.isLeft = false;
    this.friction = new SAT.Vector(FRICTION, FRICTION);
    this.direction = new SAT.Vector();
    this.maxSpeed = MAX_SPEED;
    this.deadCallback = deadCallback;
    this.dashForce = new SAT.Vector();
    this.possesDisc = false;

    // timers
    this.dashTimer = new SyncTimer();
    this.dashCooldownTimer = new SyncTimer();
  }

  onCollision(response: SAT.Response, other: BodyEntity) {
    if (this.isPuppet) return;

    // collision with disc
    if (!other.static) {
      if (!this.possesDisc) {
        if (!this.isDead) this.deadCallback(this);
        this.isDead = true;
      }
      return;
    }

    // static bodies
    this.move(-response.overlapV.x, -response.overlapV.y);
    super.onCollision(response, other);
  }

  processInput(inputs: Inputs) {
    if (this.isPuppet) return;
    // if dashing, do not move
    if (this.dashTimer.active) return;

    // if shooting
    if (inputs.mouse && this.possesDisc) {
      const dir = new SAT.Vector();
      dir.x = inputs.mousePos.x - this.position.x;
      dir.y = inputs.mousePos.y - this.position.y;
      dir.normalize();
      this.disc.shoot(dir);
    }

    // get direction
    this.direction = new SAT.Vector();
    if (inputs.keys.left) this.direction.x = -1;
    else if (inputs.keys.right) this.direction.x = 1;
    if (inputs.keys.up) this.direction.y = -1;
    else if (inputs.keys.down) this.direction.y = 1;

    // do not continue if there is no movement
    if (!(this.direction.len() > 0)) return;
    this.direction.normalize();

    // move
    const force = this.direction.clone().scale(MAX_SPEED);
    this.setVelocity(force.x, force.y);

    // apply dash
    if (inputs.keys.dash && !this.dashCooldownTimer.active) {
      this.maxSpeed = DASH_SPEED;
      this.dashForce = this.direction.clone().scale(DASH_SPEED);
      this.dashTimer.timeout(DASH_DURATION, () => {
        this.maxSpeed = MAX_SPEED;
      });
      this.dashCooldownTimer.timeout(DASH_COOLDOWN);
    }
  }

  sync(state: PlayerState) {
    this.isDead = state.isDead;
    this.isLeft = state.isLeft;
    this.possesDisc = state.possesDisc;
    this.setPosition(state.x, state.y);
    this.dashTimer.sync(state.dashTimer);
    this.dashCooldownTimer.sync(state.dashCooldownTimer);
    if (this.dashTimer.active) this.maxSpeed = DASH_SPEED;
  }

  update(dt: number): void {
    if (this.isPuppet) return;

    // timers
    this.dashCooldownTimer.update();
    this.dashTimer.update();

    // dash
    if (this.dashTimer.active) {
      this.setVelocity(this.dashForce.x, this.dashForce.y);
    }
  }
}

export { Player };
