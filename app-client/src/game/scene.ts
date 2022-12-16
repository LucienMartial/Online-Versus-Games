import { Container, DisplayObject, Graphics, Sprite } from "pixi.js";
import { Assets } from "@pixi/assets";

class Scene {
  stage: Container<DisplayObject>;
  width: number;
  height: number;
  gameObjects: { [key: string]: DisplayObject };

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.stage = new Container();
    this.gameObjects = {};
  }

  // clean up the scene
  destroy() {
    Assets.unloadBundle("basic");
    this.stage.destroy();
  }

  // load asset and create game object
  async load(): Promise<void> {
    const assets = await Assets.loadBundle("basic");

    // init character
    const character = new Sprite(assets.character);
    character.anchor.set(0.5);
    character.x = this.width * 0.1;
    character.y = this.height / 2;
    character.scale.set(1, 1);
    this.gameObjects.character = character;
    this.stage.addChild(character);

    // init basic box
    const box = new Graphics();
    box.beginFill(0x0099ff);
    const size = { x: 100, y: 200 };
    box.drawRect(
      this.width / 2 - size.x / 2,
      this.height / 2 - size.y / 2,
      size.x,
      size.y
    );
    this.stage.addChild(box);
  }

  update(dt: number): void {
    this.gameObjects.character.rotation += 0.01 * dt;
    console.log(this.gameObjects.character.position);
    console.log();
  }
}

export { Scene };
