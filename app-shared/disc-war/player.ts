import SAT from "sat";
import { BodyEntity } from "../game/index.js";
import { BoxShape } from "../physics/index.js";
import { PlayerState } from "../state/index.js";
import { Inputs, SyncTimer } from "../utils/index.js";
import { Disc } from "./index.js";

// shape
const WIDTH = 60;
const HEIGHT = 110;

// movement. 0 friction mean full determinism
const FRICTION = 0;
const MAX_SPEED = 400;
const DASH_SPEED = 1200;

// 1 second = 60 ticks
const DASH_DURATION = 0.2 * 60;
const DASH_COOLDOWN = 0.8 * 60;

// counter
const COUNTER_DURATION = 0.4 * 60;
const COUNTER_COOLDOWN = 3 * 60;

class Player extends BodyEntity {
  private isPuppet: boolean;
  disc: Disc;
  direction: SAT.Vector;
  dashForce: SAT.Vector;
  deadCallback: Function;
  isLeft: boolean;
  possesDisc: boolean;
  dashTimer: SyncTimer;
  dashCooldownTimer: SyncTimer;
  counterTimer: SyncTimer;
  counterCooldownTimer: SyncTimer;

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
    this.counterTimer = new SyncTimer();
    this.counterCooldownTimer = new SyncTimer();
  }

  sync(state: PlayerState) {
    this.isDead = state.isDead;
    this.isLeft = state.isLeft;
    this.possesDisc = state.possesDisc;
    this.setPosition(state.x, state.y);
    // dash
    this.dashTimer.sync(state.dashTimer);
    this.dashCooldownTimer.sync(state.dashCooldownTimer);
    if (this.dashTimer.active) this.maxSpeed = DASH_SPEED;
    // counter
    this.counterTimer.sync(state.counterTimer);
    this.counterCooldownTimer.sync(state.counterCooldownTimer);
  }

  onCollision(response: SAT.Response, other: BodyEntity) {
    if (this.isPuppet) return;

    // collision with disc
    if (!other.static) {
      // did try to counter
      if (this.counterTimer.active) {
        this.disc.attach(this);
      }

      // do not posses disc, did not counter
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
    if (this.isPuppet || this.isDead) return;

    // counter ability
    if (
      inputs.keys.counter &&
      !this.counterCooldownTimer.active &&
      !this.possesDisc
    ) {
      this.counterTimer.timeout(COUNTER_DURATION, () => {
        this.counterCooldownTimer.timeout(COUNTER_COOLDOWN);
      });
    }

    // shoot ability
    if (inputs.mouse && this.possesDisc) {
      // if shooting
      const dir = new SAT.Vector();
      dir.x = inputs.mousePos.x - this.position.x;
      dir.y = inputs.mousePos.y - this.position.y;
      dir.normalize();
      this.disc.shoot(dir);
    }

    // movements
    // if dashing, do not move
    if (this.dashTimer.active) return;

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

    // dash ability
    if (inputs.keys.dash && !this.dashCooldownTimer.active) {
      this.maxSpeed = DASH_SPEED;
      this.dashForce = this.direction.clone().scale(DASH_SPEED);
      this.dashTimer.timeout(DASH_DURATION, () => {
        this.maxSpeed = MAX_SPEED;
        this.dashCooldownTimer.timeout(DASH_COOLDOWN);
      });
    }
  }

  update(dt: number): void {
    if (this.isPuppet) return;

    // timers
    this.dashCooldownTimer.update();
    this.dashTimer.update();
    this.counterTimer.update();
    this.counterCooldownTimer.update();

    // dash
    if (this.dashTimer.active) {
      this.setVelocity(this.dashForce.x, this.dashForce.y);
    }
  }
}

export { Player };
