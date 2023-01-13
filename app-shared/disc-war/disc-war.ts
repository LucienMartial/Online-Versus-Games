import SAT from "sat";
import { GameEngine } from "../game/game-engine.js";
import { GameState } from "../state/game-state.js";
import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
  Inputs,
  SyncTimer,
} from "../utils/index.js";
import { Map, Player, Disc } from "./index.js";

const DISC_VELOCITY = new SAT.Vector(600, 600);
const DISC_POSITION = new SAT.Vector(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
const PLAYER_LEFT_POS = new SAT.Vector(WORLD_WIDTH / 4, WORLD_HEIGHT / 2);
const PLAYER_RIGHT_POS = new SAT.Vector(
  WORLD_WIDTH - WORLD_WIDTH / 4,
  WORLD_HEIGHT / 2
);

// times
const RESPAWN_DURATION = 2 * 60;

/**
 * Game logic for disc war
 */
class DiscWarEngine extends GameEngine {
  respawnTimer: SyncTimer;
  playerId: string;
  isServer: boolean;

  constructor(isServer = false, playerId = "") {
    super();
    this.playerId = playerId;
    this.isServer = isServer;

    // map
    const map = new Map(WORLD_WIDTH, WORLD_HEIGHT);
    for (const wall of map.walls) this.add("walls", wall);
    this.add("splitLine", map.splitLine);

    // disc
    const disc = new Disc();
    disc.setVelocity(DISC_VELOCITY.x, DISC_VELOCITY.y);
    disc.setPosition(DISC_POSITION.x, DISC_POSITION.y);
    this.add("disc", disc);

    // timers
    this.respawnTimer = new SyncTimer();
  }

  sync(state: GameState) {
    // timers
    this.respawnTimer.sync(state.respawnTimer);
  }

  // Player

  addPlayer(id: string, isLeft: boolean): Player {
    const isPuppet = !(this.isServer || id === this.playerId);
    const player = new Player(id, isPuppet, this.playerDie.bind(this));
    player.isLeft = isLeft;
    this.initPlayer(player);
    this.add("players", player);

    // attach disc (test)
    const disc = this.getOne<Disc>("disc");
    disc.attach(player);

    return player;
  }

  initPlayer(player: Player) {
    if (player.isLeft) player.setPosition(PLAYER_LEFT_POS.x, PLAYER_LEFT_POS.y);
    else player.setPosition(PLAYER_RIGHT_POS.x, PLAYER_RIGHT_POS.y);
  }

  removePlayer(id: string) {
    this.removeById("players", id);
  }

  getPlayer(id: string): Player | undefined {
    return this.getById<Player>("players", id);
  }

  async playerDie(player: Player) {
    // disc in center
    player.isDead = true;
    const disc = this.getOne<Disc>("disc");
    disc.setPosition(DISC_POSITION.x, DISC_POSITION.y);
    disc.setVelocity(0, 0);

    // reset players position
    for (const player of this.get<Player>("players")) {
      this.initPlayer(player);
    }

    // make player alive, launch ball
    this.respawnTimer.timeout(RESPAWN_DURATION, () => {
      player.isDead = false;
      disc.setVelocity(DISC_VELOCITY.x, DISC_VELOCITY.y);
    });
  }

  // Input / update

  processInput(inputs: Record<Inputs, boolean>, id: string): void {
    if (this.respawnTimer.active) return;
    const player = this.getById<Player>("players", id);
    if (!player || player.isDead) return;
    player.processInput(inputs);
  }

  // custom step function
  step(dt: number): void {
    // timers
    this.respawnTimer.update();

    for (const player of this.get<Player>("players")) {
      player.update(dt);
    }

    // apply physics
    this.physicEngine.step(dt);

    // disc
    const disc = this.getOne<Disc>("disc");
    disc.update(dt);
  }
}

export { DiscWarEngine };
