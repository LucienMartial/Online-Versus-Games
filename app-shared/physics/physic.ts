import SAT from "sat";
import { PhysicObject } from "./object.js";

// Engine parameters
const PHYSIC_RATE = 1 / 60;

/**
 * Arcade physic engine
 */
class PhysicEngine {
  private _world: Set<PhysicObject>;

  constructor() {
    this._world = new Set<PhysicObject>();
  }

  /**
   * Run the simulation at a fixed rate respecting delta time,
   * if needed, simulate multiple steps
   * @param dt
   */
  fixedUpdate(dt: number): void {
    while (dt > 0) {
      const stepTime = Math.min(dt, PHYSIC_RATE);
      this.step(PHYSIC_RATE);
      dt -= stepTime;
    }
  }

  /**
   * Run 1 step of simulation
   * @param dt
   */
  step(dt: number) {
    const objects = this._world;

    // update position and velocity
    for (const object of objects) {
      if (object.static) continue;
      // apply friction
      object.velocity.scale(object.friction.x, object.friction.y);
      // move
      object.position.add(object.velocity.clone().scale(dt));
      object.collisionShape.setPosition(object.position);
    }

    // handle collisions
    const response = new SAT.Response();
    for (const object of objects) {
      if (object.static) continue;
      for (const collidable of objects) {
        if (collidable === object) continue;

        // check collision
        response.clear();
        const collided = object.collisionShape.collideWith(
          response,
          collidable.collisionShape
        );

        // resolve collision
        if (collided) {
          object.onCollision(response, collidable);
          object.collisionShape.setPosition(object.position);
        }
      }
    }
  }

  // getters, setters
  add(object: PhysicObject) {
    this._world.add(object);
  }

  remove(object: PhysicObject) {
    this._world.delete(object);
  }

  get world(): Set<PhysicObject> {
    return this._world;
  }
}

export { PhysicEngine };
