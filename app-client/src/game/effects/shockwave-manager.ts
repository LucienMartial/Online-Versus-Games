import { ShockwaveFilter } from "@pixi/filter-shockwave";

const DEFAULT_MIN_EFFECTS = 7;
const MAX_TIME_SHOCKWAVE = 0.5;
const SHOCKWAVE_SPEED = 10;

const DEFAULT_WAVE_PARAMS = {
    RADIUS: 5000,
    WAVELENGTH: 10,
    AMPLITUDE: 10,
    BRIGHTNESS: 10
}

class ShockwaveManager {
    nbEffects: number;
    activeShockwaves: ShockwaveFilter[];
    inactiveShockWaves: ShockwaveFilter[];
    starter: boolean;

    constructor(nbEffects: number = DEFAULT_MIN_EFFECTS) {
        if (nbEffects < 2 || nbEffects > 10) {
            this.nbEffects = DEFAULT_MIN_EFFECTS;
        }

        this.nbEffects = nbEffects;
        this.activeShockwaves = [];
        this.inactiveShockWaves = [];
        this.starter = true;

        for (let i = 0; i < this.nbEffects; i++) {
            const shockwave = new ShockwaveFilter();
            this.inactiveShockWaves.push(shockwave);
        }
    }

    resetAnimations() {
        for (let i = 0; i < this.activeShockwaves.length; i++) {
            const shockwave = this.activeShockwaves[i];
            shockwave.time = MAX_TIME_SHOCKWAVE;
            this.inactiveShockWaves.push(shockwave);
            this.activeShockwaves.splice(i, 1);
        }
    }

    exportShockwaves() {
        return this.activeShockwaves.concat(this.inactiveShockWaves);
    }

    newShockwave(posX: number, posY: number, radius: number = DEFAULT_WAVE_PARAMS.RADIUS, wavelength: number = DEFAULT_WAVE_PARAMS.WAVELENGTH, amplitude: number = DEFAULT_WAVE_PARAMS.AMPLITUDE, brightness: number = DEFAULT_WAVE_PARAMS.BRIGHTNESS) {
        if (!this.starter) {return;}

        const shockwave = this.inactiveShockWaves.pop();

        if (shockwave) {
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
        }, 300);
    }

    update(dt: number) {
        for (let i = 0; i < this.activeShockwaves.length; i++) {
            console.log("Boom " + i);
            const shockwave = this.activeShockwaves[i];

            if (shockwave.time >= MAX_TIME_SHOCKWAVE) {
                shockwave.time = 4;
                this.inactiveShockWaves.push(shockwave);
                this.activeShockwaves.splice(i, 1);
            } else {
                shockwave.time += SHOCKWAVE_SPEED * dt;
            }
        }
    }
}

export { ShockwaveManager };
