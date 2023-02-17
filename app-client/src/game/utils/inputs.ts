import { Viewport } from "pixi-viewport";
import SAT, { Vector } from "sat";
import type { Inputs, KeyInputs } from "../../../../app-shared/utils";
import inputButtons from "../../types/inputButtons";
import gameInputEvent from "../../types/gameInputEvent";

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
  inputButtons?: inputButtons;

  constructor(
    viewport: Viewport,
    gameElememt: HTMLElement,
    inputButtons?: inputButtons
  ) {
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
    this.inputButtons = inputButtons;

    document.body.onkeydown = this.handleKey.bind(this);
    document.body.onkeyup = this.handleKey.bind(this);
    document.body.onmousedown = (e) => this.handleMouse({ activate : true, target : e.target, button : e.button, x : e.x, y : e.y });
    document.body.onmouseup = (e) => this.handleMouse({ activate : false, target : e.target, button : e.button, x : e.x, y : e.y });
    document.body.ontouchstart = (e) => this.handleMouse({ activate : true, target : e.target, button : 0, x : e.touches[0].clientX, y : e.touches[0].clientY });
    document.body.ontouchend = (e) => this.handleMouse({ activate : false, target : e.target, button : 0, x : e.changedTouches[0].clientX, y : e.changedTouches[0].clientY });
    gameElememt.oncontextmenu = (e) => e.preventDefault();
  }

  handleMouse(e: gameInputEvent) {
    e = e || window.event;
    // left click
    if (this.inputButtons) {
      switch (e.target) {
        case this.inputButtons.left: {
          this.keyInputs.left = e.activate;
          return;
        }
        case this.inputButtons.right: {
          this.keyInputs.right = e.activate;
          return;
        }
        case this.inputButtons.up: {
          this.keyInputs.up = e.activate;
          return;
        }
        case this.inputButtons.down: {
          this.keyInputs.down = e.activate;
          return;
        }
        case this.inputButtons.dash: {
          this.keyInputs.dash = e.activate;
          return;
        }/*
        case this.inputButtons.shield: {
          this.keyInputs.shield = e.type === "mousedown";
          return;
        }*/
        default:
          break;
      }
    }
    if (e.button === 0) {
      this.inputs.mouseLeft = e.activate;
    } else if (e.button === 2) {
      this.inputs.mouseRight = e.activate;
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
