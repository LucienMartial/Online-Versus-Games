import { Vector } from "sat";
import { Context } from "../scene";

/**
 * Default entity, contains position information
 */
abstract class Entity {
  private _position: Vector;
  onUpdate?: { (dt: number): void };

  /**
   * Create an entity provided the scene context
   * @param ctx
   */
  constructor(ctx: Context) {
    this._position = new Vector();
    this.onUpdate = undefined;
  }

  update(dt: number): void {
    this.onUpdate?.(dt);
  }

  // getters, setters
  setPosition(x: number, y: number) {
    this._position = new Vector(x, y);
  }

  get position(): Vector {
    return this._position;
  }

  move(x: number, y: number) {
    this._position.add(new Vector(x, y));
  }
}

export { Entity };
