import { Player } from "../../../../app-shared/disc-war";
import { BoxShape } from "../../../../app-shared/physics";
import { RenderObject } from "./render-object";
import { Watcher, Graphics } from "../utils";
import * as PIXI from "pixi.js";
import { DashAnimManager } from "../effects/dash-anim-manager";
import { Viewport } from "pixi-viewport";

const DEFAULT_COLOR = 0x990000;

class PlayerRender extends RenderObject {
  player: Player;
  display: PIXI.Graphics;
  deadWatcher: Watcher;
  shieldWatcher: Watcher;
  shield: PIXI.Graphics;
  viewports: Viewport;
  dashAnim: DashAnimManager;

  constructor(
    player: Player,
    id: string,
    dashAnim: DashAnimManager,
    viewports: Viewport,
    color = DEFAULT_COLOR
  ) {
    super(id);
    const shape = player.collisionShape as BoxShape;
    this.player = player;
    this.display = Graphics.createRectangle(shape.width, shape.height, color);
    this.addChild(this.display);
    this.setOffset(player.offset.x, player.offset.y);
    this.container.sortableChildren = true;

    // shield
    const radius = shape.height / 2 + 15;
    this.shield = Graphics.createCircle(radius, 0x44aadd);
    this.shield.pivot.set(-player.offset.x, -player.offset.y);
    this.shield.alpha = 0;
    this.addChild(this.shield);

    // reflection
    Graphics.createMirror(this.display, shape.height * 2);
    Graphics.createMirror(this.shield, shape.height);

    this.viewports = viewports;

    // dash
    this.dashAnim = dashAnim;

    // shield watcher
    this.shieldWatcher = new Watcher();
    this.shieldWatcher.onActive = () => {
      this.shield.alpha = 0.2;
    };
    this.shieldWatcher.onInactive = () => {
      this.shield.alpha = 0;
    };

    // dead watcher
    this.deadWatcher = new Watcher();
    this.deadWatcher.onActive = () => {
      this.display.alpha = 0.5;
    };
    this.deadWatcher.onInactive = () => {
      this.display.alpha = 1;
    };

    // dash
    this.player.onDash = (posX: number, posY: number) => {
      this.dashAnim.newDashAnim(posX, posY);
    };
  }

  update(dt: number, now: number) {
    super.update(dt, now);
    // dashAnim
    // this.dashAnim.update(dt);
    // watchers
    this.deadWatcher.watch(this.player.isDead);
    this.shieldWatcher.watch(this.player.counterTimer.active);
    this.position.set(this.player.position.x, this.player.position.y);
    this.shield.position = this.display.position.clone();
  }
}

export { PlayerRender };
