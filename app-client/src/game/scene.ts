import { Container, DisplayObject } from "pixi.js";
import { InputManager } from "./utils/input";
import { PhysicEngine } from "../../../app-shared/physics";
import { CollectionManager } from "./entities";

/**
 * Context object containing scene data
 */
class Context {
  stage: Container<DisplayObject>;
  physicEngine: PhysicEngine;
  inputManager: InputManager;
  width: number;
  height: number;

  constructor(
    stage: Container<DisplayObject>,
    physicEngine: PhysicEngine,
    inputManager: InputManager,
    width: number,
    height: number
  ) {
    this.stage = stage;
    this.physicEngine = physicEngine;
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
  collections: CollectionManager;

  constructor(width: number, height: number) {
    this.elapsed = 0;
    this.collections = new CollectionManager();
    const stage = new Container();
    const inputManager = new InputManager();
    const physicEngine = new PhysicEngine();
    this.ctx = new Context(stage, physicEngine, inputManager, width, height);
  }

  // clean up the scene
  destroy() {
    this.ctx.stage.destroy();
  }

  // load asset and create game objects
  abstract load(): Promise<void>;

  update(now: number, dt: number): void {
    // update logic
    this.elapsed += dt;
    this.ctx.physicEngine.fixedUpdate(dt);

    // update entities
    this.collections.update(dt);
  }
}

export { Scene, Context };
