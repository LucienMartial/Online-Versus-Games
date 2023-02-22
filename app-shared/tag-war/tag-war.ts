import { GameEngine } from "../game/game-engine.js";
import { Inputs } from "../types/inputs.js";
import { GameState } from "./state/game-state.js";

class TagWarEngine extends GameEngine {
  constructor(isServer = false, playerId = "") {
    super(isServer, playerId);
  }

  sync(_state: GameState) {}
  processInput(_inputs: Inputs, _id: string) {}
  step(_dt: number): void {}
}

export { TagWarEngine };
