import SAT from "sat";
import { BodyEntity } from "../game/body-entity.js";
import { CircleShape } from "../physics/collision.js";

const FRICTION = 1;
const RADIUS = 50;
const MAX_SPEED = 2000;

class Disc extends BodyEntity {
  constructor() {
    // default
    const collisionShape = new CircleShape(RADIUS);
    super(collisionShape, false);

    // custom
    this.friction = new SAT.Vector(FRICTION, FRICTION);
    this.maxSpeed = MAX_SPEED;
  }

  onCollision(response: SAT.Response, other: BodyEntity): void {
    this.velocity.reflectN(response.overlapN.perp());
    this.position.sub(response.overlapV);
  }
}

export { Disc };
