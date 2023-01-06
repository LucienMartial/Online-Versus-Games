import { Assets } from "@pixi/assets";
import { Sprite } from "pixi.js";
import { BoxShape, LineShape } from "../../../app-shared/physics";
import { DiscWarEngine } from "../../../app-shared/disc-war/disc-war";
import { Player } from "../../../app-shared/disc-war/player";
import { BodyEntity } from "../../../app-shared/game";
import { Scene } from "./scene";
import { Graphics } from "./utils/graphics";
import { RenderObject } from "./renderer";

/**
 * Game scene, all logic is in game engine
 */
class GameScene extends Scene {
  gameEngine: DiscWarEngine;

  constructor(width: number, height: number) {
    super(width, height);
    this.gameEngine = new DiscWarEngine();
  }

  async load(): Promise<void> {
    const assets = await Assets.loadBundle("basic");

    // map
    const walls = this.gameEngine.get<BodyEntity>("walls");
    for (const wall of walls) {
      const shape = wall.collisionShape as LineShape;
      const displayLine = Graphics.createLine(
        shape.p1.x,
        shape.p1.y,
        shape.p2.x,
        shape.p2.y,
        5
      );
      const wallRender = new RenderObject(this.ctx, displayLine);
      wallRender.setPosition(wall.position.x, wall.position.y);
    }

    // init character
    const characterDisplay = new Sprite(assets.character);
    const character = new RenderObject(this.ctx, characterDisplay);
    character.setPosition(this.ctx.width * 0.8, this.ctx.height / 2);
    character.setOffset(150, 150);
    character.onUpdate = (dt: number) => {
      character.rotate(-0.5 * dt);
      character.move(0, Math.cos(this.elapsed) * 5);
    };

    // init box
    for (const box of this.gameEngine.get<BodyEntity>("boxes")) {
      const shape = box.collisionShape as BoxShape;
      const boxDisplay = Graphics.createRectangle(shape.width, shape.height);
      const boxRender = new RenderObject(this.ctx, boxDisplay);
      boxRender.onUpdate = (dt: number) => {
        boxRender.setPosition(box.position.x, box.position.y);
        boxRender.setOffset(box.offset.x, box.offset.y);
        boxRender.setRotation(box.rotation);
      };
    }

    // init player
    const id = "temporary";
    this.gameEngine.addPlayer(id);
    const player = this.gameEngine.getById<Player>("players", id);
    if (!player) return;

    // player render
    const shape = player.collisionShape as BoxShape;
    const playerDisplay = Graphics.createRectangle(shape.width, shape.height);
    const playerRender = new RenderObject(this.ctx, playerDisplay);
    playerRender.onUpdate = (dt: number) => {
      playerRender.setPosition(player.position.x, player.position.y);
    };
  }

  destroy() {
    Assets.unload("basic");
    super.destroy();
  }

  update(dt: number) {
    // base update
    super.update(dt);

    // current inputs
    const inputs = this.ctx.inputManager.inputs;
    this.gameEngine.processInput(inputs, "temporary");

    // game engine
    this.gameEngine.update(dt, this.elapsed);
  }
}

export { GameScene };
