import { Player } from "../../../../app-shared/disc-war";
import { BoxShape } from "../../../../app-shared/physics";
import { RenderObject } from "./render-object";
import { Watcher, Graphics } from "../utils";
import * as PIXI from "pixi.js";

const DEFAULT_COLOR = 0x990000;

class PlayerRender extends RenderObject {
  player: Player;
  display: PIXI.Graphics;
  deadHandled: boolean;
  deadWatcher: Watcher;

  constructor(player: Player, id: string, color = DEFAULT_COLOR) {
    super(id);
    const shape = player.collisionShape as BoxShape;
    this.player = player;
    this.display = Graphics.createRectangle(shape.width, shape.height, color);
    this.deadHandled = false;
    this.addChild(this.display);
    this.setOffset(player.offset.x, player.offset.y);

    // watcher
    this.deadWatcher = new Watcher();
    this.deadWatcher.onActive = () => {
      this.display.alpha = 0.5;
    };
    this.deadWatcher.onInactive = () => {
      this.display.alpha = 1;
    };
  }

  update(dt: number, now: number) {
    super.update(dt, now);

    // watchers
    this.deadWatcher.watch(this.player.isDead);

    // if (this.player.isDead) return;
    this.position.set(this.player.position.x, this.player.position.y);
  }
}

export { PlayerRender };
