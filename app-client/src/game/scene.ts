import { Container, DisplayObject } from "pixi.js";
import { RenderObject } from "./renderer";
import { InputManager } from "./utils/input";

/**
 * Context object containing scene data
 */
class Context {
  renderables: Set<RenderObject>;
  stage: Container<DisplayObject>;
  inputManager: InputManager;
  width: number;
  height: number;

  constructor(
    stage: Container<DisplayObject>,
    inputManager: InputManager,
    width: number,
    height: number
  ) {
    this.renderables = new Set<RenderObject>();
    this.stage = stage;
    this.inputManager = inputManager;
    this.width = width;
    this.height = height;
  }
}

/**
 * Main scene containing the game
 */
abstract class Scene {
  elapsed = 0;
  ctx: Context;

  constructor(width: number, height: number) {
    this.elapsed = 0;
    const stage = new Container();
    const inputManager = new InputManager();
    this.ctx = new Context(stage, inputManager, width, height);
  }

  // clean up the scene
  destroy() {
    this.ctx.stage.destroy();
  }

  // load asset and create game objects
  abstract load(): Promise<void>;

  update(dt: number): void {
    this.elapsed += dt;
  }

  updateRenderables(dt: number) {
    for (const object of this.ctx.renderables.values()) {
      object.update(dt);
    }
  }
}

export { Scene, Context };
