import { Room } from "colyseus.js";
import { Vector } from "sat";
import { Disc, DiscWarEngine } from "../../../../app-shared/disc-war";
import { GameState } from "../../../../app-shared/state/game-state";
import { CBuffer, InputsData, lerp } from "../../../../app-shared/utils";

const MAX_RESIMU_STEP = 75;
const MAX_DESYNC_DEVIATION = 100;
const MAX_NB_INPUTS = 1000;
const PLAYER_BEND = 0.3;
const DISC_BEND = 0.8;
const OTHER_PLAYERS_BEND = 0.3;

/**
 * Shadow object, contain information used for bending
 * at the end of reconciliation to synchronize to server data
 */
class Shadow {
  oPosition: Vector;
  oVelocity: Vector;

  /**
   * Register position before extrapolation, used for bending afterward
   */
  constructor(position: Vector, velocity: Vector) {
    this.oPosition = new Vector().copy(position);
    this.oVelocity = new Vector().copy(velocity);
  }

  /**
   * Interpolate between client predicted and server authorative data
   */
  bend(position: Vector, velocity: Vector, factor = 0.1) {
    factor = Math.min(factor, 1);
    position.x = lerp(this.oPosition.x, position.x, factor);
    position.y = lerp(this.oPosition.y, position.y, factor);
    velocity.x = lerp(this.oVelocity.x, velocity.x, factor);
    velocity.y = lerp(this.oVelocity.y, velocity.y, factor);
  }
}

/**
 * Predict next game state, handle synchronization with the server
 */
class Predictor {
  gameEngine: DiscWarEngine;
  playerId: string;
  inputs: CBuffer<InputsData>;
  room: Room;
  delta: number;
  lastDelta: number;

  constructor(gameEngine: DiscWarEngine, playerId: string, room: Room) {
    this.gameEngine = gameEngine;
    this.playerId = playerId;
    this.room = room;
    this.inputs = new CBuffer<InputsData>(MAX_NB_INPUTS);
    this.delta = 0;
    this.lastDelta = 0;
  }

  /**
   * register inputs for future reconciliation, process it afterward
   */
  processInput(inputData: InputsData) {
    this.room.send("input", inputData);
    if (this.gameEngine.respawnTimer.active) return;
    this.inputs.push(structuredClone(inputData));
    this.gameEngine.processInput(inputData.inputs, this.playerId);
  }

  /**
   * Directly update the game after player input, regardless of server response
   */
  predict(dt: number) {
    if (this.inputs.size() > MAX_RESIMU_STEP) return;
    this.gameEngine.fixedUpdate(dt);
  }

  /**
   * Synchronize state with server, extrapolating using registered inputs
   * and bending at the end
   */
  synchronize(state: GameState, now: number) {
    // other players
    this.syncOtherPlayers(state);

    // get main player
    const player = this.gameEngine.getPlayer(this.playerId);
    const playerState = state.players.get(this.playerId);
    if (!player || !playerState) return;

    // save shadows
    const disc = this.gameEngine.getOne<Disc>("disc");
    const discShadow = new Shadow(disc.position, disc.velocity);
    const playerShadow = new Shadow(player.position, player.velocity);

    // synchronize
    this.gameEngine.sync(state);
    disc.sync(state.disc, this.gameEngine);
    player.sync(playerState);

    // re simulate (extrapolation)
    const lastInputTime = state.lastInputs.get(this.playerId);
    if (!lastInputTime) return;
    this.reconciliate(lastInputTime);

    // check ping time
    this.delta = now - lastInputTime;
    this.handleDesync();

    // bending phase
    discShadow.bend(disc.position, disc.velocity, DISC_BEND);
    playerShadow.bend(player.position, player.velocity, PLAYER_BEND);
  }

  /**
   * Sync the other players "puppet", here we interpolate the position
   */
  syncOtherPlayers(state: GameState) {
    for (const [id, playerState] of state.players.entries()) {
      if (id === this.playerId) continue;
      const player = this.gameEngine.getPlayer(id);
      if (!player) continue;
      // interpolate new position
      player.lerpTo(playerState.x, playerState.y, OTHER_PLAYERS_BEND);
    }
  }

  /**
   * When the ping deviation is high, that mean we have a big desync.
   * Send a message to the server, telling that we are desync
   */
  handleDesync() {
    if (this.lastDelta - this.delta > MAX_DESYNC_DEVIATION) {
      this.room.send("desync");
    }
    this.lastDelta = this.delta;
  }

  /**
   * Re apply input from a point of time, fully simulating multiple game steps
   */
  reconciliate(start: number) {
    let i = 0;
    for (const data of this.inputs.toArray()) {
      if (data.time > start) {
        this.inputs.remove(i);
        if (this.inputs.size() > MAX_RESIMU_STEP) {
          this.inputs.remove(this.inputs.size() - MAX_RESIMU_STEP);
          return;
        }

        // re apply input and re simulate the game
        this.gameEngine.reenact = true;
        let last = data.time;
        for (const input of this.inputs.toArray()) {
          const now = input.time;
          let dt = (now - last) * 0.001;
          last = input.time;
          this.gameEngine.processInput(input.inputs, this.playerId);
          this.gameEngine.fixedUpdate(dt);
        }
        this.gameEngine.reenact = false;

        break;
      }
      i++;
    }
  }
}

export { Predictor };
