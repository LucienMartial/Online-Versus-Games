import { Viewport } from "pixi-viewport";
import SAT, { Vector } from "sat";
import type { Inputs, KeyInputs } from "../../../../app-shared/utils";

const KeyBind: Record<KeyInputs, string[]> = {
  left: ["KeyQ", "KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  up: ["KeyW", "KeyZ", "ArrowUp"],
  down: ["KeyS", "ArrowDown"],
  dash: ["Space"],
  counter: ["ShiftLeft"],
};

class InputManager {
  inputs: Inputs;
  keyInputs: Record<KeyInputs, boolean>;
  viewport: Viewport;

  constructor(viewport: Viewport, gameElememt: HTMLElement) {
    this.viewport = viewport;
    this.keyInputs = {
      left: false,
      right: false,
      up: false,
      down: false,
      dash: false,
      counter: false,
    };

    this.inputs = {
      keys: this.keyInputs,
      mouseLeft: false,
      mouseRight: false,
      mousePos: new SAT.Vector(0, 0),
    };

    document.body.onkeydown = this.handleKey.bind(this);
    document.body.onkeyup = this.handleKey.bind(this);
    document.body.onmousedown = this.handleMouse.bind(this);
    document.body.onmouseup = this.handleMouse.bind(this);
    gameElememt.oncontextmenu = (e) => e.preventDefault();
  }

  handleMouse(e: MouseEvent) {
    e = e || window.event;
    // left click
    if (e.button === 0) {
      this.inputs.mouseLeft = e.type === "mousedown";
    } else if (e.button === 2) {
      this.inputs.mouseRight = e.type === "mousedown";
    }
    const mousePos = this.viewport.toWorld(e.x, e.y);
    this.inputs.mousePos = new Vector(mousePos.x, mousePos.y);
  }

  handleKey(e: KeyboardEvent) {
    e = e || window.event;
    const state = e.type === "keydown";
    for (const key in this.keyInputs) {
      if (KeyBind[key as KeyInputs].includes(e.code)) {
        this.keyInputs[key as KeyInputs] = state;
      }
    }
  }
}

export { InputManager };
