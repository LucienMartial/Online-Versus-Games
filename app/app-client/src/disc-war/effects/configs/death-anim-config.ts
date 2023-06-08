import { WIDTH, HEIGHT } from "../../../../../app-shared/disc-war/player";

const DEATH_ANIMATION = {
  CONFIG_1: {
    alpha: {
      start: 1,
      end: 0,
    },
    scale: {
      start: 0.01,
      end: 0.02,
      minimumScaleMultiplier: 1,
    },
    color: {
      start: "ffffff",
      end: "ffffff",
    },
    speed: {
      start: 200,
      end: 100,
      minimumSpeedMultiplier: 1,
    },
    acceleration: {
      x: 0,
      y: 0,
    },
    startRotation: {
      min: 0,
      max: 360,
    },
    rotationSpeed: {
      min: 0,
      max: 0,
    },
    lifetime: {
      min: 0.2,
      max: 0.4,
    },
    blendMode: "normal",
    frequency: 0.01,
    emitterLifetime: 0.4,
    maxParticles: 1000,
    pos: {
      x: 0,
      y: 0,
    },
    addAtBack: false,
    spawnType: "point",
  },

  CONFIG_2: {
    alpha: {
      start: 1,
      end: 0,
    },
    scale: {
      start: 0.1,
      end: 0.3,
      minimumScaleMultiplier: 1,
    },
    color: {
      start: "ffffff",
      end: "ffffff",
    },
    speed: {
      start: 400,
      end: 800,
      minimumSpeedMultiplier: 1,
    },
    acceleration: {
      x: 0,
      y: 0,
    },
    startRotation: {
      min: 0,
      max: 360,
    },
    rotationSpeed: {
      min: 0,
      max: 0,
    },
    lifetime: {
      min: 0.1,
      max: 0.3,
    },
    blendMode: "normal",
    frequency: 0.001,
    emitterLifetime: 0.4,
    maxParticles: 10000,
    pos: {
      x: 0,
      y: 0,
    },
    addAtBack: false,
    spawnType: "circle",
    spawnCircle: {
      x: 0,
      y: 0,
      r: 10,
    },
  },
  CONFIG_3: {
    alpha: {
      start: 1,
      end: 0,
    },
    scale: {
      start: 0.007,
      end: 0.08,
      minimumScaleMultiplier: 1.5,
    },
    color: {
      start: "ffffff",
      end: "ffffff",
    },
    speed: {
      start: 500,
      end: 200,
      minimumSpeedMultiplier: 1.5,
    },
    acceleration: {
      x: 0,
      y: 0,
    },
    startRotation: {
      min: 0,
      max: 360,
    },
    rotationSpeed: {
      min: 0,
      max: 0,
    },
    lifetime: {
      min: 0.5,
      max: 0.8,
    },
    blendMode: "lighten",
    frequency: 0.005,
    emitterLifetime: 0.8,
    maxParticles: 10000000,
    pos: {
      x: 0,
      y: 0,
    },
    addAtBack: true,
    spawnType: "rect",
    spawnRect: {
      x: 0,
      y: 0,
      w: WIDTH / 2,
      h: HEIGHT / 2,
    },
  },

  CONFIG_4: {
    alpha: {
      start: 1,
      end: 0,
    },
    scale: {
      start: 0.01,
      end: 0.1,
      minimumScaleMultiplier: 1.5,
    },
    color: {
      start: "ffffff",
      end: "ffffff",
    },
    speed: {
      start: 500,
      end: 200,
      minimumSpeedMultiplier: 1,
    },
    acceleration: {
      x: 0,
      y: 0,
    },
    startRotation: {
      min: 0,
      max: 360,
    },
    rotationSpeed: {
      min: 0,
      max: 0,
    },
    lifetime: {
      min: 0.5,
      max: 0.8,
    },
    blendMode: "lighten",
    frequency: 0.001,
    emitterLifetime: 0.5,
    maxParticles: 100000,
    pos: {
      x: 0,
      y: 0,
    },
    addAtBack: true,
    spawnType: "rect",
    spawnRect: {
      x: 0,
      y: 0,
      w: WIDTH / 2,
      h: HEIGHT / 2,
    },
    /*spawnType: "circle",
    spawnCircle: {
      x: 0,
      y: 0,
      r: 10,
    },*/
  },
};

export { DEATH_ANIMATION };
