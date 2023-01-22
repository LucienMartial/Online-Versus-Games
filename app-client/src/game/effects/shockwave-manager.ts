import { ShockwaveFilter } from "@pixi/filter-shockwave";
import { Vector } from "sat";
import { Disc, DiscWarEngine } from "../../../../app-shared/disc-war";

const DEFAULT_MIN_EFFECTS = 7;
const MAX_TIME_SHOCKWAVE = 1.2;
const SHOCKWAVE_SPEED = 8;

const DEFAULT_WAVE_PARAMS = {
  RADIUS: 100,
  WAVELENGTH: 200,
  AMPLITUDE: 25,
  BRIGHTNESS: 1.2,
};

class ShockwaveManager {
  nbEffects: number;
  activeShockwaves: ShockwaveFilter[];
  inactiveShockWaves: ShockwaveFilter[];
  starter: boolean;
  lastPos: Vector;
  engine: DiscWarEngine;

  constructor(nbEffects: number = DEFAULT_MIN_EFFECTS, engine: DiscWarEngine) {
    if (nbEffects < 2 || nbEffects > 10) {
      this.nbEffects = DEFAULT_MIN_EFFECTS;
    }

    this.engine = engine;

    this.nbEffects = nbEffects;
    this.activeShockwaves = [];
    this.inactiveShockWaves = [];
    this.starter = true;
    this.lastPos = new Vector();

    for (let i = 0; i < this.nbEffects; i++) {
      const shockwave = new ShockwaveFilter();
      shockwave.enabled = false;
      this.inactiveShockWaves.push(shockwave);
    }
  }

  resetAnimations() {
    for (let i = 0; i < this.activeShockwaves.length; i++) {
      const shockwave = this.activeShockwaves[i];
      shockwave.time = MAX_TIME_SHOCKWAVE;
      shockwave.enabled = false;
      this.inactiveShockWaves.push(shockwave);
      this.activeShockwaves.splice(i, 1);
    }
  }

  exportShockwaves() {
    return this.activeShockwaves.concat(this.inactiveShockWaves);
  }

  newShockwave(
    posX: number,
    posY: number,
    radius: number = DEFAULT_WAVE_PARAMS.RADIUS,
    wavelength: number = DEFAULT_WAVE_PARAMS.WAVELENGTH,
    amplitude: number = DEFAULT_WAVE_PARAMS.AMPLITUDE,
    brightness: number = DEFAULT_WAVE_PARAMS.BRIGHTNESS
  ) {
    if (!this.starter) return;
    const shockwave = this.inactiveShockWaves.pop();

    if (shockwave) {
      shockwave.enabled = true;
      shockwave.time = 0;
      shockwave.center = [posX, posY];
      shockwave.radius = radius;
      shockwave.wavelength = wavelength;
      shockwave.amplitude = amplitude;
      shockwave.brightness = brightness;
      this.activeShockwaves.push(shockwave);
    }

    this.starter = false;
    setTimeout(() => {
      this.starter = true;
    }, 250);
  }

  update(dt: number) { 
    for (let i = 0; i < this.activeShockwaves.length; i++) {
      const shockwave = this.activeShockwaves[i];

      if (shockwave.time >= MAX_TIME_SHOCKWAVE) {
        shockwave.time = 4;
        shockwave.enabled = false;
        this.inactiveShockWaves.push(shockwave);
        this.activeShockwaves.splice(i, 1);
      } else {
        shockwave.time += SHOCKWAVE_SPEED * dt;
      }
    }
  }
}

export { ShockwaveManager };
