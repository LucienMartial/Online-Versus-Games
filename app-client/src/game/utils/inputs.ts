import { Viewport } from "pixi-viewport";
import SAT, { Vector } from "sat";
import type { Inputs, KeyInputs } from "../../../../app-shared/utils";
import InputButtons from "../../types/inputButtons";
import gameInputEvent from "../../types/gameInputEvent";

const KeyBind: Record<KeyInputs, string[]> = {
  left: ["KeyQ", "KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  up: ["KeyW", "KeyZ", "ArrowUp"],
  down: ["KeyS", "ArrowDown"],
  space: ["Space"],
  shift: ["ShiftLeft"],
};

class InputManager {
  inputs: Inputs;
  keyInputs: Record<KeyInputs, boolean>;
  viewport: Viewport;
  inputButtons?: InputButtons;
  rightClickSwitch: boolean;

  constructor(
    viewport: Viewport,
    gameElememt: HTMLElement,
  ) {
    this.viewport = viewport;
    this.keyInputs = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false,
      shift: false,
    };
    this.inputs = {
      keys: this.keyInputs,
      mainShootAction: false,
      secondaryShootAction: false,
      mousePos: new SAT.Vector(0, 0),
    };

    this.rightClickSwitch = false;
    document.body.onkeydown = this.handleKey.bind(this);
    document.body.onkeyup = this.handleKey.bind(this);
    document.body.onmousedown = (e) => {
      this.handleMouseOrTouch({
        activate: true,
        target: e.target,
        button: e.button,
        x: e.x,
        y: e.y,
      }, true);
    };
    document.body.onmouseup = (e) => {
      this.handleMouseOrTouch({
        activate: false,
        target: e.target,
        button: e.button,
        x: e.x,
        y: e.y,
      }, true);
    };
    document.body.ontouchstart = (e) => {
      this.handleMouseOrTouch({
        activate: true,
        target: e.target,
        button: 0,
        x: e.touches[e.touches.length - 1].clientX,
        y: e.touches[e.touches.length - 1].clientY,
      }, false);
    };
    document.body.ontouchend = (e) => {
      this.handleMouseOrTouch({
        activate: false,
        target: e.target,
        button: 0,
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }, false);
    };
    gameElememt.oncontextmenu = (e) => e.preventDefault();
  }

  feedInputButtons(inputButton: InputButtons) {
    this.inputButtons = inputButton;
  }

  handleMouseOrTouch(e: gameInputEvent, mouse: boolean) {
    e = e || window.event;
    if (this.inputButtons && !mouse) {
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
        case this.inputButtons.space: {
          this.keyInputs.space = e.activate;
          return;
        }
        case this.inputButtons.shift: {
          this.keyInputs.shift = e.activate;
          return;
        }
        case this.inputButtons.rightClick: {
          if (e.activate === true) {
            this.rightClickSwitch = !this.rightClickSwitch;
          }
          return;
        }
        default:
          break;
      }
    }
    if (e.button === 0 && !this.rightClickSwitch) {
      this.inputs.mainShootAction = e.activate;
    } else if (e.button === 2 || (e.button === 0 && this.rightClickSwitch)) {
      this.inputs.secondaryShootAction = e.activate;
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
