import {Player} from "../../../../app-shared/disc-war";
import {BoxShape} from "../../../../app-shared/physics";
import {Graphics} from "../utils/graphics";
import {RenderObject} from "./render-object";
import * as PIXI from "pixi.js";

const DEFAULT_COLOR = 0x990000;

class PlayerRender extends RenderObject {
  player: Player;
  display: PIXI.Graphics;
  deadHandled: boolean;

  constructor(player: Player, id: string, color = DEFAULT_COLOR) {
    super(id);

    const shape = player.collisionShape as BoxShape;
    this.player = player;
    this.display = Graphics.createRectangle(shape.width, shape.height, color);
    this.deadHandled = false;
    this.addChild(this.display);
  }

  update(dt: number, now: number) {
    this.position.set(this.player.position.x, this.player.position.y);
    if (this.player.isDead && !this.deadHandled) {
      this.display.alpha = 0.5;
      this.timer.setTimeout(() => {
          this.display.alpha = 0;
      }, 1000);
      this.deadHandled= true;
    }
    if(!this.player.isDead && this.deadHandled) {
        this.deadHandled = false;
    }
    super.update(dt, now);
  }
}

export { PlayerRender };
