import SAT from "sat";
import { BodyEntity } from "../game/body-entity.js";
import { CircleShape } from "../physics/collision.js";
import { DiscState } from "../state/disc-state.js";
import { MIDDLE_LINE_ID } from "../utils/constants.js";
import { Player } from "./player.js";
import { DiscWarEngine } from "./index.js";

const FRICTION = 1;
const RADIUS = 42;
const MAX_SPEED = 1800;

class Disc extends BodyEntity {
  isAttached: boolean;
  attachedPlayer?: Player;
  lastSpeed: number;

  constructor() {
    // default
    const collisionShape = new CircleShape(RADIUS);
    super(collisionShape, false);

    // custom
    this.friction = new SAT.Vector(FRICTION, FRICTION);
    this.maxSpeed = MAX_SPEED;
    this.isAttached = false;
    this.lastSpeed = 0;
  }

  setVelocity(x: number, y: number): void {
    super.setVelocity(x, y);
    const len = this.velocity.len();
    if (len > 0) this.lastSpeed = len;
  }

  onCollision(response: SAT.Response, other: BodyEntity): void {
    if (!other.static || other.id === MIDDLE_LINE_ID || this.isAttached) return;
    this.velocity.reflectN(response.overlapN.perp());
    this.velocity.scale(1.01);
    const len = this.velocity.len();
    if (len > 0) this.lastSpeed = len;
    this.position.sub(response.overlapV);
    super.onCollision(response, other);
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

  shoot(direction: SAT.Vector) {
    this.detach();
    const force = direction.scale(this.lastSpeed);
    this.setVelocity(force.x, force.y);
  }

  sync(state: DiscState, engine: DiscWarEngine) {
    this.setPosition(state.x, state.y);
    this.setVelocity(state.vx, state.vy);
    this.lastSpeed = state.lastSpeed;
    this.isAttached = state.isAttached;
    if (this.isAttached) {
      const attachedPlayer = engine.getPlayer(state.attachedPlayer);
      if (attachedPlayer) this.attachedPlayer = attachedPlayer;
    }
  }

  update(dt: number): void {
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
