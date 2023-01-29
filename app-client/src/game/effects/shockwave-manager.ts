import { ShockwaveFilter } from "@pixi/filter-shockwave";
import { Viewport } from "pixi-viewport";
import { DiscWarEngine } from "../../../../app-shared/disc-war";

const DEFAULT_MIN_EFFECTS = 7;
const MAX_TIME_SHOCKWAVE = 0.75;
const SHOCKWAVE_SPEED = 18;

const DEFAULT_WAVE_PARAMS = {
  RADIUS: 80,
  WAVELENGTH: 80,
  AMPLITUDE: 20,
  BRIGHTNESS: 1.5,
};

class ShockwaveManager {
  nbEffects: number;
  activeShockwaves: ShockwaveFilter[];
  inactiveShockWaves: ShockwaveFilter[];
  engine: DiscWarEngine;
  viewport: Viewport;

  constructor(
    engine: DiscWarEngine,
    viewport: Viewport,
    nbEffects: number = DEFAULT_MIN_EFFECTS
  ) {
    if (nbEffects < 2 || nbEffects > 10) {
      this.nbEffects = DEFAULT_MIN_EFFECTS;
    }

    this.engine = engine;
    this.viewport = viewport;

    this.nbEffects = nbEffects;
    this.activeShockwaves = [];
    this.inactiveShockWaves = [];

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
    if (this.engine.reenact) return;
    const shockwave = this.inactiveShockWaves.pop();

    if (shockwave) {
      shockwave.enabled = true;
      shockwave.time = 0;
      shockwave.center = [posX, posY];
      shockwave.radius = radius * this.viewport.scale.y;
      shockwave.amplitude = amplitude;
      shockwave.wavelength = wavelength;
      shockwave.brightness = brightness;
      this.activeShockwaves.push(shockwave);
    }
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
