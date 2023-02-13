import { DiscWarEngine } from "../../../../app-shared/disc-war";
import { Emitter } from "pixi-particles";

class DeathAnimManager {
  gameEngine: DiscWarEngine;
  dashEmitter: Emitter;
  activatable: boolean;

  constructor(gameEngine: DiscWarEngine, dashEmitter: Emitter) {
    this.gameEngine = gameEngine;
    this.dashEmitter = dashEmitter;
    this.dashEmitter.emit = false;
    this.activatable = true;
  }

  resetAnimations() {
    this.dashEmitter.emit = false;
    this.activatable = true;
    this.dashEmitter.cleanup();
  }

  newDeathAnim(x: number, y: number) {
    if (!this.activatable) return;
    this.dashEmitter.emit = true;
    this.dashEmitter.updateOwnerPos(x, y);
    this.dashEmitter.autoUpdate = true;
    this.dashEmitter.resetPositionTracking();
    this.dashEmitter.playOnce(() => {
      this.resetAnimations();
    });
    this.activatable = false;
  }
}

export { DeathAnimManager };

// https://pixijs.io/particle-emitter/docs/classes/Emitter.html
