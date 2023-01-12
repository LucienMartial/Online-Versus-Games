import SAT from "sat";
import { BodyEntity } from "../game/body-entity.js";
import { CircleShape } from "../physics/collision.js";
import { MIDDLE_LINE_ID } from "../utils/constants.js";
import { Player } from "./player.js";

const FRICTION = 1;
const RADIUS = 50;
const MAX_SPEED = 3000;

class Disc extends BodyEntity {
  isAttached: boolean;
  attachedPlayer?: Player;

  constructor() {
    // default
    const collisionShape = new CircleShape(RADIUS);
    super(collisionShape, false);

    // custom
    this.friction = new SAT.Vector(FRICTION, FRICTION);
    this.maxSpeed = MAX_SPEED;
    this.isAttached = false;
  }

  onCollision(response: SAT.Response, other: BodyEntity): void {
    if (!other.static || other.id === MIDDLE_LINE_ID || this.isAttached) return;
    this.velocity.reflectN(response.overlapN.perp());
    this.velocity.scale(1.01);
    this.position.sub(response.overlapV);
    super.onCollision(response, other);
  }

  attach(player: Player) {
    this.attachedPlayer = player;
    this.isAttached = true;
  }

  update(dt: number): void {
    if (this.isAttached) {
      this.position.x = this.attachedPlayer.position.x + RADIUS * 2;
      this.position.y = this.attachedPlayer.position.y;
    }
  }
}

export { Disc };
