import { GameEngine } from "../game/game-engine.js";
import { Inputs } from "../types/inputs.js";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../utils/constants.js";
import { GameState } from "./state/game-state.js";
import { Map, Player } from "./index.js";

class TagWarEngine extends GameEngine {
  constructor(isServer = false, playerId = "") {
    super(isServer, playerId);

    const map = new Map(WORLD_WIDTH, WORLD_HEIGHT);
    for (const wall of map.walls) this.add("walls", wall);
    this.add("top-left-wall", map.topLeftWall);
    this.add("top-middle-wall", map.topMiddleWall);
    this.add("top-right-wall", map.topRightWall);
    this.add("map", map);
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
    player.setPosition(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
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
