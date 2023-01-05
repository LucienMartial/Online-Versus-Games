import { DisplayObject } from "pixi.js";
import { Context } from "../scene";
import { Entity } from "./entity";

/**
 * Renderable game object
 */
class RenderEntity extends Entity {
  displayObject: DisplayObject;
  private _rotation: number;

  constructor(ctx: Context, displayObject: DisplayObject) {
    super(ctx);
    this._rotation = 0;
    this.displayObject = displayObject;
    ctx.stage.addChild(this.displayObject);
  }

  update(now: number, dt: number) {
    super.update(now, dt);
  }

  render() {
    this.displayObject.position.set(this.position.x, this.position.y);
    this.displayObject.rotation = this._rotation;
  }

  // getters, setters
  setOffset(x: number, y: number): void {
    this.displayObject.pivot.set(x, y);
  }

  setRotation(angle: number) {
    this._rotation = angle;
  }

  rotate(angle: number) {
    this._rotation += angle;
  }

  get rotation(): number {
    return this._rotation;
  }
}

export { RenderEntity };
