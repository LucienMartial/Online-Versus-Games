import SAT from "sat";
import { GameEngine } from "../game/game-engine.js";
import { GameState } from "../state/game-state.js";
import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
  Inputs,
  SyncTimer,
  GAME_RATE,
} from "../utils/index.js";
import { Map, Player, Disc } from "./index.js";

const DISC_VELOCITY = new SAT.Vector(700, 700);
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
  leftScore: number;
  rightScore: number;
  paused: boolean;

  constructor(isServer = false, playerId = "") {
    super();
    this.playerId = playerId;
    this.isServer = isServer;
    this.leftScore = 0;
    this.rightScore = 0;
    this.paused = true;

    // map
    const map = new Map(WORLD_WIDTH, WORLD_HEIGHT);
    for (const wall of map.walls) this.add("walls", wall);
    this.add("top-left-wall", map.topLeftWall);
    this.add("top-middle-wall", map.topMiddleWall);
    this.add("top-right-wall", map.topRightWall);
    this.add("splitLine", map.splitLine);
    this.add("map", map);

    // disc
    const disc = new Disc();
    disc.setVelocity(DISC_VELOCITY.x, DISC_VELOCITY.y);
    disc.setPosition(DISC_POSITION.x, DISC_POSITION.y);
    this.add("disc", disc);

    // timers
    this.respawnTimer = new SyncTimer();
  }

  sync(state: GameState) {
    this.paused = state.paused;
    // scores
    this.leftScore = state.leftScore;
    this.rightScore = state.rigthScore;
    // timers
    this.respawnTimer.sync(state.respawnTimer);
    // synchronize players
    for (const [id, playerState] of state.players.entries()) {
      if (id === this.playerId) continue;
      const player = this.getPlayer(id);
      if (!player) continue;
      // interpolate new position
      player.isDead = playerState.isDead;
      player.isLeft = playerState.isLeft;
      player.possesDisc = playerState.possesDisc;
      player.counterTimer.active = playerState.counterTimer.active;
      if (player.isDead || this.respawnTimer.active) {
        player.setPosition(playerState.x, playerState.y);
      }
    }
  }

  // start the game
  startGame() {
    // choose random player
    const players = Array.from(this.get<Player>("players").values());
    const randomPlayer = players[Math.floor(Math.random() * players.length)];

    // give him the disc
    const disc = this.getOne<Disc>("disc");
    disc.attach(randomPlayer);

    // timer before the game start
    this.respawnTimer.timeout(200, () => {
      this.paused = false;
    });
  }

  // Player

  addPlayer(id: string, isLeft: boolean): Player {
    const isPuppet = !(this.isServer || id === this.playerId);
    const disc = this.getOne<Disc>("disc");
    const player = new Player(id, isPuppet, this.playerDie.bind(this), disc);
    player.isLeft = isLeft;

    this.initPlayer(player);
    this.add("players", player);
    return player;
  }

  initPlayer(player: Player) {
    if (player.isLeft) player.setPosition(PLAYER_LEFT_POS.x, PLAYER_LEFT_POS.y);
    else player.setPosition(PLAYER_RIGHT_POS.x, PLAYER_RIGHT_POS.y);
  }

  removePlayer(id: string) {
    const player = this.getPlayer(id);
    if (!player) return;
    if (player.possesDisc) {
      const disc = this.getOne<Disc>("disc");
      disc.detach();
      disc.setPosition(DISC_POSITION.x, DISC_POSITION.y);
      disc.setVelocity(DISC_VELOCITY.x, DISC_VELOCITY.y);
    }
    this.removeById("players", id);
  }

  getPlayer(id: string): Player | undefined {
    return this.getById<Player>("players", id);
  }

  async playerDie(player: Player) {
    // disc in center
    const disc = this.getOne<Disc>("disc");
    disc.reset();
    disc.setPosition(DISC_POSITION.x, DISC_POSITION.y);
    disc.setVelocity(0, 0);

    // player
    player.isDead = true;
    if (player.isLeft) this.leftScore += 1;
    else this.rightScore += 1;

    // reset players position
    for (const player of this.get<Player>("players")) {
      this.initPlayer(player);
      player.counterCooldownTimer.reset();
      player.counterTimer.reset();
    }

    // make player alive, launch ball
    this.respawnTimer.timeout(RESPAWN_DURATION, () => {
      player.isDead = false;
      disc.attach(player);
      disc.setVelocity(DISC_VELOCITY.x, DISC_VELOCITY.y);
    });
  }

  // Input / update

  processInput(inputs: Inputs, id: string): void {
    if (this.paused || this.respawnTimer.active) return;
    const player = this.getById<Player>("players", id);
    if (!player || player.isDead) return;
    player.processInput(inputs);
  }

  // custom step function
  step(dt: number): void {
    // timers
    this.respawnTimer.update();

    if (this.paused) return;

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
