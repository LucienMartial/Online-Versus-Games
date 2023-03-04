import { GameEngine } from "../game/game-engine.js";
import { Inputs } from "../types/inputs.js";
import { Player } from "./player.js";
import { GameState } from "./state/game-state.js";

class TagWarEngine extends GameEngine {
  constructor(isServer = false, playerId = "") {
    super(isServer, playerId);
  }

  sync(_state: GameState) {}

  processInput(inputs: Inputs, id: string) {
    const player = this.getPlayer(id);
    if (!player) return;
    player.processInput(inputs);
  }

  step(dt: number): void {
    // update players
    for (const player of this.get<Player>("players")) {
      player.update(dt);
    }
    // apply physics
    this.physicEngine.step(dt);
  }

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
