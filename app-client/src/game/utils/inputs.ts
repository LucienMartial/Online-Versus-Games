import { Viewport } from "pixi-viewport";
import { Point } from "pixi.js";
import SAT, { Vector } from "sat";
import type { Inputs, KeyInputs } from "../../../../app-shared/utils";

const KeyBind: Record<KeyInputs, string[]> = {
  left: ["q", "a", "ArrowLeft"],
  right: ["d", "ArrowRight"],
  up: ["z", "w", "ArrowUp"],
  down: ["s", "ArrowDown"],
  dash: [" "],
};

class InputManager {
  inputs: Inputs;
  keyInputs: Record<KeyInputs, boolean>;
  viewport: Viewport;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
    this.keyInputs = {
      left: false,
      right: false,
      up: false,
      down: false,
      dash: false,
    };

    this.inputs = {
      keys: this.keyInputs,
      mouse: false,
      mousePos: new SAT.Vector(0, 0),
    };

    document.body.onkeydown = this.handleKey.bind(this);
    document.body.onkeyup = this.handleKey.bind(this);
    document.body.onmousedown = this.handleMouse.bind(this);
    document.body.onmouseup = this.handleMouse.bind(this);
  }

  handleMouse(e: MouseEvent) {
    this.inputs.mouse = e.type === "mousedown";
    const mousePos = this.viewport.toWorld(e.x, e.y);
    this.inputs.mousePos = new Vector(mousePos.x, mousePos.y);
  }

  handleKey(e: KeyboardEvent) {
    const state = e.type === "keydown";
    for (const key in this.keyInputs) {
      if (KeyBind[key as KeyInputs].includes(e.key)) {
        this.keyInputs[key as KeyInputs] = state;
      }
    }
  }
}

export { InputManager };
