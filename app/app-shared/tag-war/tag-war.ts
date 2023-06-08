import { GameEngine } from "../game/game-engine.js";
import { Inputs } from "../types/inputs.js";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../utils/constants.js";
import { GameState } from "./state/game-state.js";
import { Map, Player } from "./index.js";
import { SyncTimer } from "../utils/sync-timer.js";

const START_DURATION = 3 * 60;

class TagWarEngine extends GameEngine {
  mapConfigId: number = 0;
  respawnTimer: SyncTimer;
  paused: boolean = false;

  constructor(isServer = false, playerId = "") {
    super(isServer, playerId);

    const map = new Map(WORLD_WIDTH, WORLD_HEIGHT);
    for (const wall of map.walls) this.add("walls", wall);
    for (const wall of map.leftHomeWalls) this.add("left-home-walls", wall);
    for (const wall of map.rightHomeWalls) this.add("right-home-walls", wall);
    this.add("top-left-wall", map.topLeftWall);
    this.add("top-middle-wall", map.topMiddleWall);
    this.add("top-right-wall", map.topRightWall);
    this.add("map", map);

    // timer
    this.respawnTimer = new SyncTimer();
  }

  sync(state: GameState) {
    this.mapConfigId = state.mapConfigId;
    // timer
    this.respawnTimer.sync(state.respawnTimer);
    // pause
    this.paused = state.paused;
  }

  processInput(inputs: Inputs, id: string) {
    if (this.paused) return;
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

  addPlayer(id: string, isThief: boolean): Player {
    const isPuppet = !(this.isServer || id === this.playerId);

    if (!isPuppet) {
      console.log("isThief", isThief);
    }

    const player = new Player(
      id,
      isPuppet,
      isThief,
      this.playerTouched.bind(this),
    );
    this.add("players", player);
    return player;
  }

  removePlayer(id: string) {
    this.removeById("players", id);
  }

  getPlayer(id: string): Player | undefined {
    return this.getById<Player>("players", id);
  }

  async playerTouched(player: Player) {
    if (this.paused) return;
    player.isDead = true;
    this.paused = true;
    setTimeout(
      this.endGame.bind(this),
      2000,
    );
  }

  /**
   * Game
   */

  // start the game
  startGame() {
    // timer before the game start
    this.respawnTimer.timeout(START_DURATION, () => {
      this.paused = false;
    });
  }

  endGame(): void {
    super.endGame();
  }
}

export { TagWarEngine };
