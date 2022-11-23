import * as PIXI from "pixi.js";
import { isBoxedPrimitive } from "util/types";

/**
 * Game application managing its own pixijs application
 */

const sizeX = 100;
const sizeY = 200;

export class GameApp {
  pixiApp: PIXI.Application;

  /**
   * Init the app creating a pixijs application with given canvas
   * @param canvas html canvas
   */
  constructor(canvas: HTMLCanvasElement) {
    this.pixiApp = new PIXI.Application({
      view: canvas,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x000011,
    });
    // basic box
    const box = new PIXI.Graphics();
    box.beginFill(0x0099ff);
    const width = this.pixiApp.view.width;
    const height = this.pixiApp.view.height;
    box.drawRect(width / 2 - sizeX / 2, height / 2 - sizeY / 2, sizeX, sizeY);
    this.pixiApp.stage.addChild(box);
  }

  /**
   * Update when window get resized, keep aspect ratio
   */
  resize() {
    let width = this.pixiApp.renderer.width;
    let height = this.pixiApp.renderer.height;
    const ratio = width / height;
    if (window.innerWidth / window.innerHeight >= ratio) {
      width = window.innerHeight * ratio;
      height = window.innerHeight;
    } else {
      width = window.innerWidth;
      height = window.innerWidth / ratio;
    }
    this.pixiApp.view.style!.width = width + "px";
    this.pixiApp.view.style!.height = height + "px";
  }

  /**
   * Load the game assets
   */
  load() {}

  /**
   * Run the game app calling update and render
   */
  run() {
    window.requestAnimationFrame(this.run.bind(this));
  }
}
