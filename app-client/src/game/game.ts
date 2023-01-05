import { Assets } from "@pixi/assets";
import { Sprite } from "pixi.js";
import { BoxShape } from "../../../app-shared/physics";
import { BodyEntity, RenderEntity } from "./entities";
import { MapManager } from "./map-manager";
import { Player } from "./player";
import { Scene } from "./scene";
import { Graphics } from "./utils/graphics";

/**
 * Main scene containing the game
 */
class GameScene extends Scene {
  player?: Player;

  constructor(width: number, height: number) {
    super(width, height);
  }

  async load(): Promise<void> {
    const assets = await Assets.loadBundle("basic");

    // map
    const mapManager = new MapManager(this.ctx);
    this.collections.add("map", mapManager);

    // init character
    const characterDisplay = new Sprite(assets.character);
    const character = new RenderEntity(this.ctx, characterDisplay);
    character.setPosition(this.ctx.width * 0.8, this.ctx.height / 2);
    character.setOffset(150, 150);
    character.onUpdate = (dt) => {
      character.rotate(-0.5 * dt);
      character.move(0, Math.cos(this.elapsed) * 5);
    };
    this.collections.add("renderable", character);

    // init player with dash
    this.player = new Player(this.ctx);
    this.player.setPosition(this.ctx.width / 3, this.ctx.height / 2);
    this.player.accelerate(-300, 300);
    this.collections.add("player", this.player);

    // init basic box
    const size = { x: 100, y: 200 };
    const boxDisplay = Graphics.createRectangle(size.x, size.y, 0x0099ff);
    const box = new BodyEntity(
      this.ctx,
      boxDisplay,
      new BoxShape(size.x, size.y),
      false
    );
    box.setPosition(this.ctx.width / 2, this.ctx.height / 2);
    box.setRotation(Math.PI / 2);
    box.setOffset(50, 100);
    box.onUpdate = (dt) => {
      box.rotate(2 * dt);
      box.move(Math.cos(this.elapsed) * 5, Math.cos(this.elapsed * 0.8));
    };
    this.collections.add("box", box);

    // renderable entity, example of collection group
    this.collections.addCollection("renderable", ["player", "box"]);
    this.render();
  }

  destroy(): void {
    Assets.unload("basic");
    super.destroy();
  }

  update(now: number, dt: number): void {
    // current inputs
    const inputs = this.ctx.inputManager.inputs;

    // player
    this.player?.processInput(inputs);

    // render
    this.render();

    // base update
    super.update(now, dt);
  }

  render() {
    for (const entity of this.collections.get<RenderEntity>("renderable")) {
      entity.render();
    }
  }
}

export { GameScene };
