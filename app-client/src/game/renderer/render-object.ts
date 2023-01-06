import { DisplayObject, ObservablePoint } from "pixi.js";
import { Context } from "../scene";

/**
 * Renderable object
 */
class RenderObject {
  private displayObject: DisplayObject;
  onUpdate?: { (dt: number): void };

  constructor(ctx: Context, displayObject: DisplayObject) {
    this.displayObject = displayObject;
    ctx.stage.addChild(this.displayObject);
    ctx.renderables.add(this);
  }

  update(dt: number) {
    this.onUpdate?.(dt);
  }

  // getters, setters
  setPosition(x: number, y: number) {
    this.displayObject.position.set(x, y);
  }

  setOffset(x: number, y: number): void {
    this.displayObject.pivot.set(x, y);
  }

  setRotation(angle: number) {
    this.displayObject.rotation = angle;
  }

  move(x: number, y: number) {
    this.displayObject.position.x += x;
    this.displayObject.position.y += y;
  }

  rotate(angle: number) {
    this.displayObject.rotation += angle;
  }

  get position(): ObservablePoint {
    return this.displayObject.position;
  }

  get rotation(): number {
    return this.displayObject.rotation;
  }
}

export { RenderObject };
