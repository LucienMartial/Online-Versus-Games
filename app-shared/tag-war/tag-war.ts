import { GameEngine } from "../game/game-engine.js";
import { Inputs } from "../types/inputs.js";
import { Player } from "./player.js";
import { GameState } from "./state/game-state.js";

class TagWarEngine extends GameEngine {
  constructor(isServer = false, playerId = "") {
    super(isServer, playerId);
  }

  sync(_state: GameState) {}
  processInput(_inputs: Inputs, _id: string) {}
  step(_dt: number): void {}

  /**
   * Player
   */

  addPlayer(id: string): Player {
    const isPuppet = !(this.isServer || id === this.playerId);
    const player = new Player(id, isPuppet);
    this.add("players", player);
    return player;
  }

  removePlayer(id: string) {
    this.removeById("players", id);
  }

  getPlayer(id: string): Player | undefined {
    return this.getById<Player>("players", id);
  }
}

export { TagWarEngine };
