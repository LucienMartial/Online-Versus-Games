import { DisplayObject } from "pixi.js";
import { Vector } from "sat";
import { CollisionShape, Entity } from "../../../app-shared/physics";

/**
 * Basic game object
 */
abstract class GameObject {
  position: Vector;

  constructor() {
    this.position = new Vector();
  }

  abstract update(dt: number): void;
  abstract render(): void;

  // getters, setters
  move(x: number, y: number) {
    this.position.x += x;
    this.position.y += y;
  }
}

/**
 * Renderable game object
 */
class RenderObject extends GameObject {
  displayObject: DisplayObject;
  rotation: number;
  private offset: Vector;

  constructor(displayObject: DisplayObject) {
    super();
    this.displayObject = displayObject;
    this.rotation = 0;
    this.offset = new Vector();
  }

  update(dt: number) {}

  render() {
    this.displayObject.position.set(this.position.x, this.position.y);
    this.displayObject.rotation = this.rotation;
  }

  // getters, setters
  setOffset(x: number, y: number): void {
    this.displayObject.pivot.set(x, y);
  }

  rotate(angle: number) {
    this.rotation += angle;
  }
}

/**
 * Renderable game object with collision body
 */
class CollisionObject extends RenderObject {
  physicObject: Entity;

  constructor(
    displayObject: DisplayObject,
    collisionShape: CollisionShape,
    isStatic = false
  ) {
    super(displayObject);
    this.physicObject = new Entity(collisionShape, isStatic);
    this.physicObject.setPosition(this.position.x, this.position.y);
  }

  update(dt: number) {
    super.update(dt);
    this.position = this.physicObject.position;
  }

  // getters, setters
  setPosition(x: number, y: number): void {
    this.physicObject.setPosition(x, y);
  }

  setOffset(x: number, y: number): void {
    super.setOffset(x, y);
    this.physicObject.setOffset(x, y);
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

export { GameObject, RenderObject, CollisionObject };
