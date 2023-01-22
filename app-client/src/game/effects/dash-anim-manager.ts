import { DiscWarEngine } from "../../../../app-shared/disc-war";
import { Emitter } from "pixi-particles";

const EFFECT_SPEED = 1;

class DashAnimManager {
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

    newDashAnim(x: number, y: number) {
        if (!this.activatable) { return; }

        this.dashEmitter.emit = true;
        this.dashEmitter.updateOwnerPos(x, y);
        this.dashEmitter.autoUpdate = true;
        this.dashEmitter.resetPositionTracking();
        this.dashEmitter.playOnce(() => { this.resetAnimations(); });
        this.activatable = false;
    }

    update(dt: number) {
        // usless because autoupdate is true
        if (this.dashEmitter.emit) {
            this.dashEmitter.update(dt * EFFECT_SPEED);
        }
    }

}

export { DashAnimManager };

// https://pixijs.io/particle-emitter/docs/classes/Emitter.html
