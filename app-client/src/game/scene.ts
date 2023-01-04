import { Container, DisplayObject, Sprite } from "pixi.js";
import { Assets } from "@pixi/assets";
import { PhysicEngine, Entity, BoxShape } from "../../../app-shared/physics";
import {
  GameObject,
  RenderObject,
  CollisionObject,
  Context,
} from "./game-object";
import { Graphics } from "./graphics";
import { InputManager } from "./input";
import {Player} from "./player";

/**
 * Main scene containing the game
 */
class Scene {
  elapsed = 0;
  width: number;
  height: number;
  ctx: Context;

  constructor(width: number, height: number) {
    this.elapsed = 0;
    this.width = width;
    this.height = height;
    const stage = new Container();
    const inputManager = new InputManager();
    const physicEngine = new PhysicEngine();
    this.ctx = new Context(stage, physicEngine, inputManager);
  }

  // clean up the scene
  destroy() {
    Assets.unloadBundle("basic");
    this.ctx.stage.destroy();
  }

  // load asset and create game object
  async load(): Promise<void> {
    const assets = await Assets.loadBundle("basic");

    // init character
    const characterDisplay = new Sprite(assets.character);
    const character = new RenderObject(this.ctx, characterDisplay);
    character.setPosition(this.width * 0.8, this.height / 2);
    character.setOffset(150, 150);
    character.onUpdate = (dt) => {
      character.rotate(-0.5 * dt);
      character.move(0, Math.cos(this.elapsed) * 5);
    };

    // init player with dash
    const playerDash = new Player(this.ctx);
    playerDash.accelerate(1500, 1500);

    // init basic box
    const size = { x: 100, y: 200 };
    const boxDisplay = Graphics.createRectangle(size.x, size.y, 0x0099ff);
    const box = new CollisionObject(
      this.ctx,
      boxDisplay,
      new BoxShape(size.x, size.y),
      false
    );
    box.setPosition(this.width / 2, this.height / 2);
    box.setRotation(Math.PI / 2);
    box.setOffset(50, 100);
    box.onUpdate = (dt) => {
      box.rotate(2 * dt);
    };
  }

  update(now: number, dt: number): void {
    // update logic
    this.elapsed += dt;
    this.ctx.physicEngine.fixedUpdate(dt);

    // update and render
    for (const object of Object.values(this.ctx.gameObjects)) {
      object.update(dt);
      object.render();
    }
  }
}

export { Scene };
