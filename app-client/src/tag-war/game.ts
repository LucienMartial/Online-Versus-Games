import { Client, Room } from "colyseus.js";
import { Viewport } from "pixi-viewport";
import { PlayerState } from "../../../app-shared/tag-war/state";
import { GameState } from "../../../app-shared/tag-war/state";
import { TagWarEngine } from "../../../app-shared/tag-war/tag-war";
import { InputsData } from "../../../app-shared/types";
import { GameScene } from "../game/scene";

class TagWarScene extends GameScene<GameState> {
  gameEngine: TagWarEngine;

  constructor(
    viewport: Viewport,
    sceneElement: HTMLElement,
    client: Client,
    room: Room<GameState>,
  ) {
    super(viewport, sceneElement, client, room);
    this.gameEngine = new TagWarEngine(false, this.id);
  }

  async load(): Promise<void> {}
  destroy() {}

  initGame(_state: GameState) {}
  addPlayer(_id: string, _state: PlayerState) {}
  removePlayer(_id: string) {}

  update(dt: number, now: number) {
    super.update(dt, now);

    // current input
    const inputs = this.inputManager.inputs;
    const _inputData: InputsData = {
      time: now,
      inputs: inputs,
    };
  }
}

export { TagWarScene };
