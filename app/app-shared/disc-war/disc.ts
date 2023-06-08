import SAT from "sat";
import { BodyEntity } from "../game/body-entity.js";
import { CircleShape } from "../physics/collision.js";
import { DiscState } from "./state/disc-state.js";
import { MIDDLE_LINE_ID } from "../utils/constants.js";
import { Player } from "./player.js";
import { DiscWarEngine } from "./index.js";
import { SyncTimer } from "../utils/sync-timer.js";

const FRICTION = 1;
const RADIUS = 38;
const MAX_SPEED = 1550;

// slow motion at the beginning of shoot
// to give players reaction time
const SLOW_MOTION_TIME = 25;

class Disc extends BodyEntity {
  isAttached: boolean;
  attachedPlayer?: Player;
  lastSpeed: number;
  slowTimer: SyncTimer;
  curveTimer: SyncTimer;
  shootForce: SAT.Vector;
  onWallCollision?: { (posX: number, posY: number): void };

  constructor() {
    // default
    const collisionShape = new CircleShape(RADIUS);
    super(collisionShape, false);

    // custom
    this.friction = new SAT.Vector(FRICTION, FRICTION);
    this.maxSpeed = MAX_SPEED;
    this.isAttached = false;
    this.lastSpeed = 0;
    this.shootForce = new SAT.Vector();

    // timers
    this.slowTimer = new SyncTimer(true);
    this.slowTimer.callback = () => {
      this.maxSpeed = MAX_SPEED;
      this.setVelocity(this.shootForce.x, this.shootForce.y);
    };
    this.curveTimer = new SyncTimer();
  }

  setVelocity(x: number, y: number): void {
    super.setVelocity(x, y);
    const len = this.velocity.len();
    if (len > 0) this.lastSpeed = len;
  }

  reset() {
    this.detach();
    this.slowTimer.reset();
    this.curveTimer.reset();
    this.maxSpeed = MAX_SPEED;
  }

  onCollision(response: SAT.Response, other: BodyEntity): void {
    if (other.id === MIDDLE_LINE_ID) {
      if (this.attachedPlayer && this.attachedPlayer.friendlyDisc) {
        this.attachedPlayer.friendlyDisc = false;
      }
    }
    if (!other.static || other.id === MIDDLE_LINE_ID || this.isAttached) return;
    this.curveTimer.reset();
    this.velocity.reflectN(response.overlapN.perp());
    this.velocity.scale(1.01);
    const len = this.velocity.len();
    if (len > 0) this.lastSpeed = len;
    this.position.sub(response.overlapV);
    super.onCollision(response, other);
    this.onWallCollision?.(this.position.x, this.position.y);
  }

  attach(player: Player) {
    // last attached player
    this.detach();

    // new one
    this.attachedPlayer = player;
    this.attachedPlayer.possesDisc = true;
    this.isAttached = true;
    this.update(0);
  }

  detach() {
    if (this.attachedPlayer) {
      this.attachedPlayer.possesDisc = false;
    }
    this.isAttached = false;
  }

  shoot(direction: SAT.Vector, isCurved = false) {
    this.detach();
    if (this.attachedPlayer) {
      this.attachedPlayer.friendlyDisc = true;
    }
    this.shootForce = direction.scale(this.lastSpeed);

    // give players reaction time
    this.maxSpeed = 100;
    this.setVelocity(this.shootForce.x, this.shootForce.y);
    this.slowTimer.timeout(SLOW_MOTION_TIME);

    // curve shot
    if (isCurved) {
      if (this.shootForce.y > 0) this.shootForce.y += 800;
      else this.shootForce.y -= 800;
      this.curveTimer.timeout(38 + SLOW_MOTION_TIME);
    }
  }

  sync(state: DiscState, engine: DiscWarEngine) {
    this.setPosition(state.x, state.y);
    this.setVelocity(state.vx, state.vy);
    this.shootForce.x = state.shootx;
    this.shootForce.y = state.shooty;
    this.lastSpeed = state.lastSpeed;

    // attached
    this.isAttached = state.isAttached;
    if (this.isAttached) {
      const attachedPlayer = engine.getPlayer(state.attachedPlayer);
      if (attachedPlayer) this.attachedPlayer = attachedPlayer;
    }

    // timers
    this.slowTimer.sync(state.slowTimer);
    this.curveTimer.sync(state.curveTimer);
  }

  update(dt: number): void {
    this.curveTimer.update();
    this.slowTimer.update();

    if (this.curveTimer.active && !this.slowTimer.active) {
      if (this.shootForce.y > 0) this.velocity.y -= 35;
      else this.velocity.y += 35;
    }

    if (this.isAttached) {
      if (!this.attachedPlayer) return;
      if (this.attachedPlayer.isDead) return;
      this.velocity = new SAT.Vector(0, 0);
      const offset = this.attachedPlayer.isLeft ? RADIUS * 2 : -RADIUS * 2;
      this.position.x = this.attachedPlayer.position.x + offset;
      this.position.y = this.attachedPlayer.position.y;
    }
  }
}

export { Disc };
