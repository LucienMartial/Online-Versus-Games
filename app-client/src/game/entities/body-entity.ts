import { DisplayObject } from "pixi.js";
import { CollisionShape, PhysicObject } from "../../../../app-shared/physics";
import { Context } from "../scene";
import { RenderEntity } from "./render-entity";

/**
 * Renderable game object with collision body
 */
class BodyEntity extends RenderEntity {
  physicObject: PhysicObject;

  constructor(
    ctx: Context,
    displayObject: DisplayObject,
    collisionShape: CollisionShape,
    isStatic = false
  ) {
    super(ctx, displayObject);
    this.physicObject = new PhysicObject(collisionShape, isStatic);
    this.physicObject.setPosition(this.position.x, this.position.y);
    ctx.physicEngine.world.add(this.physicObject);
  }

  update(now: number, dt: number) {
    super.update(now, dt);
    this.setPosition(
      this.physicObject.position.x,
      this.physicObject.position.y
    );
  }

  // getters, setters
  setPosition(x: number, y: number): void {
    super.setPosition(x, y);
    this.physicObject.setPosition(x, y);
  }

  setRotation(angle: number) {
    super.setRotation(angle);
    this.physicObject.setRotation(angle);
  }

  setOffset(x: number, y: number): void {
    super.setOffset(x, y);
    this.physicObject.setOffset(x, y);
  }

  move(x: number, y: number) {
    super.move(x, y);
    this.physicObject.setPosition(this.position.x, this.position.y);
  }

  accelerate(x: number, y: number) {
    this.physicObject.velocity.x += x;
    this.physicObject.velocity.y += y;
  }

  rotate(angle: number): void {
    super.rotate(angle);
    this.physicObject.setRotation(this.physicObject.rotation + angle);
  }
}

export { BodyEntity };
