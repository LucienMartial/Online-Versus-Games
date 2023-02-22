import { Player } from "../../../../app-shared/disc-war";
import { BoxShape } from "../../../../app-shared/physics";
import { RenderObject } from "./render-object";
import { Watcher, Graphics } from "../utils";
import * as PIXI from "pixi.js";
import { DashAnimManager } from "../../disc-war/effects/dash-anim-manager";
import { DeathAnimManager } from "../../disc-war/effects/death-anim-manager";
import { Viewport } from "pixi-viewport";
import { Cosmetics } from "./cosmetics/cosmetics";
import { CosmeticAssets } from "../configs/assets-config";
import { DEFAULT_SKIN } from "../../../../app-shared/configs/shop-config";
import { Container } from "pixi.js";

class PlayerRender extends RenderObject {
  player: Player;
  display: PIXI.Graphics;
  deadWatcher: Watcher;
  shieldWatcher: Watcher;
  shield: PIXI.Graphics;
  viewports: Viewport;
  dashAnim: DashAnimManager;
  deathAnim: DeathAnimManager;
  cosmetics: Cosmetics;
  reflection: PIXI.Graphics;
  reflectionContainer: PIXI.Container;

  constructor(
    player: Player,
    id: string,
    dashAnim: DashAnimManager,
    deathAnim: DeathAnimManager,
    viewports: Viewport,
    cosmeticsAssets: CosmeticAssets
  ) {
    super(id);
    this.viewports = viewports;
    const shape = player.collisionShape as BoxShape;
    this.player = player;
    this.display = Graphics.createRectangle(
      shape.width,
      shape.height,
      0xffffff
    );
    this.display.tint = DEFAULT_SKIN;
    this.addChild(this.display);
    this.setOffset(player.offset.x, player.offset.y);
    this.container.sortableChildren = true;

    // shield
    const radius = shape.height / 2 + 15;
    this.shield = Graphics.createCircle(radius, 0x44aadd);
    this.shield.pivot.set(-player.offset.x, -player.offset.y);
    this.shield.alpha = 0;
    this.addChild(this.shield);

    // player display reflection
    this.reflection = this.display.clone();
    this.reflection.tint = 0x555555;

    // cosmetics
    this.cosmetics = new Cosmetics(this, cosmeticsAssets);
    this.cosmetics.loadCosmetics(player.cosmetics);
    this.cosmetics.container.zIndex = 1;
    this.container.addChild(this.cosmetics.container);

    // alpha filter for uniform transparency with multiple objects
    const reflectionAlpha = new PIXI.filters.AlphaFilter();
    reflectionAlpha.alpha = 0.3;

    // final reflection
    this.reflectionContainer = new Container();
    this.reflectionContainer.filters = [reflectionAlpha];
    this.reflectionContainer.scale.y = -1;
    this.reflectionContainer.pivot.y = shape.height * 2;
    this.reflectionContainer.addChild(this.reflection);
    this.reflectionContainer.addChild(this.cosmetics.reflection);
    this.display.addChild(this.reflectionContainer);
    Graphics.createMirror(this.shield, shape.height);

    this.dashAnim = dashAnim;

    // death
    this.deathAnim = deathAnim;

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
      this.display.alpha = 0.1;
      this.cosmetics.container.alpha = 0.1;
    };
    this.deadWatcher.onInactive = () => {
      this.display.alpha = 1;
      this.cosmetics.container.alpha = 1;
    };

    // dash
    this.player.onDash = (posX: number, posY: number) => {
      this.dashAnim.newDashAnim(posX, posY);
    };

    // death
    this.player.onDeath = (
      posX: number,
      posY: number,
      width: number,
      height: number
    ) => {
      this.deathAnim.newDeathAnim(posX, posY);
    };
  }

  update(dt: number, now: number) {
    super.update(dt, now);
    // dashAnim & deathAnim (auto update is on)
    this.deadWatcher.watch(this.player.isDead);
    this.shieldWatcher.watch(this.player.counterTimer.active);
    this.position.set(this.player.position.x, this.player.position.y);
    this.shield.position = this.display.position.clone();
  }
}

export { PlayerRender };
