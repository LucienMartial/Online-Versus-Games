import { Emitter } from "pixi-particles";
import { GameEngine } from "../../../../app-shared/game";

class DeathAnimManager {
  gameEngine: GameEngine;
  dashEmitter: Emitter;
  activatable: boolean;

  constructor(gameEngine: GameEngine, dashEmitter: Emitter) {
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
