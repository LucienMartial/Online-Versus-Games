import { GameEngine } from "../game/game-engine.js";
import { GameState } from "../state/game-state.js";
import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
  Inputs,
  timeout,
  Timer,
} from "../utils/index.js";
import { Map, Player, Disc } from "./index.js";

/**
 * Game logic for disc war
 */
class DiscWarEngine extends GameEngine {
  respawnTimer: Timer;

  constructor() {
    super();

    // map
    const map = new Map(WORLD_WIDTH, WORLD_HEIGHT);
    for (const wall of map.walls) this.add("walls", wall);

    // disc
    const disc = new Disc();
    disc.setPosition(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    disc.setVelocity(800, 100);
    this.add("disc", disc);

    // timers
    this.registerTimer();
  }

  // Timers

  registerTimer() {
    this.respawnTimer = new Timer();
  }

  sync(state: GameState) {
    for (const [id, playerState] of state.players.entries()) {
      const player = this.getPlayer(id);
      if (player) player.isDead = playerState.isDead;
    }
    this.respawnTimer.sync(state.respawnTimer);
  }

  // Player

  addPlayer(id: string): Player {
    const player = new Player(id, this.playerDie.bind(this));
    player.setPosition(WORLD_WIDTH / 3, WORLD_HEIGHT / 2);
    this.add("players", player);
    return player;
  }

  removePlayer(id: string) {
    this.removeById("players", id);
  }

  getPlayer(id: string): Player | undefined {
    return this.getById<Player>("players", id);
  }

  async playerDie(player: Player) {
    // disc in center
    this.respawnTimer.reset();
    const disc = this.getOne<Disc>("disc");
    disc.setPosition(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    disc.setVelocity(0, 0);
    player.setPosition(WORLD_WIDTH / 3, WORLD_HEIGHT / 2);

    // player in position
    this.respawnTimer.add(30, () => {
      player.isDead = false;
      disc.setVelocity(800, 100);
      this.respawnTimer.reset();
    });
  }

  // Input / update

  processInput(inputs: Record<Inputs, boolean>, id: string): void {
    const player = this.getById<Player>("players", id);
    if (!player || player.isDead) return;
    player.processInput(inputs);
  }

  fixedUpdate(dt: number): void {
    super.fixedUpdate(dt);
    this.respawnTimer.update();
  }
}

export { DiscWarEngine };
