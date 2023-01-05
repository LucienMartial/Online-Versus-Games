import SAT from "sat";
import { CollisionShape } from "./collision.js";

// Default values
const FRICTION = 0.95;

/**
 * Physic entity, renderless, usable on server and client
 */
class PhysicObject {
  position: SAT.Vector;
  velocity: SAT.Vector;
  friction: SAT.Vector;
  offset: SAT.Vector;
  rotation: number;
  static: boolean;
  collisionShape: CollisionShape;

  constructor(collisionShape: CollisionShape, isStatic = true) {
    this.position = new SAT.Vector();
    this.velocity = new SAT.Vector();
    this.friction = new SAT.Vector(FRICTION, FRICTION);
    this.offset = new SAT.Vector();
    this.rotation = 0;
    this.static = isStatic;
    this.collisionShape = collisionShape;
  }

  setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
    this.collisionShape.setPosition(this.position);
  }

  setOffset(x: number, y: number) {
    this.offset = new SAT.Vector(-x, -y);
    this.collisionShape.setOffset(this.offset);
  }

  setRotation(angle: number) {
    this.rotation = angle;
    this.collisionShape.setRotation(angle);
  }

  /**
   * Basic collision response
   */
  onCollision(response: SAT.Response, other: PhysicObject) {
    this.position.sub(response.overlapV);
  }
}

export { PhysicObject };
