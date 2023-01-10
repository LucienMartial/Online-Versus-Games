import { DiscWarEngine } from "../../../../app-shared/disc-war";
import { BodyEntity } from "../../../../app-shared/game";
import { GameState } from "../../../../app-shared/state/game-state";
import { GAME_RATE, InputData, lerp } from "../../../../app-shared/utils";
import { PlayerRender } from "../renderer";

const MAX_RESIMU_STEP = 50;

// predict next game state, handle synchronization with server
// for the moment, only handle player
class Predictor {
  gameEngine: DiscWarEngine;
  playerId: string;
  inputs: InputData[];

  constructor(gameEngine: DiscWarEngine, playerId: string) {
    this.gameEngine = gameEngine;
    this.playerId = playerId;
    this.inputs = [];
  }

  processInput(inputData: InputData) {
    this.inputs.push(structuredClone(inputData));
    this.gameEngine.processInput(
      inputData.time,
      inputData.inputs,
      this.playerId
    );
  }

  predict(dt: number, now: number) {
    if (this.inputs.length > MAX_RESIMU_STEP) return;
    this.gameEngine.fixedUpdate(dt, now);
  }

  synchronize(state: GameState) {
    // synchronize players
    for (const [id, playerState] of state.players.entries()) {
      const player = this.gameEngine.getPlayer(id);
      if (!player) continue;
      if (playerState.isDashing) return;
      player.setPosition(playerState.x, playerState.y);
      player.dashStart = playerState.dashStart;
      player.isDashing = playerState.isDashing;
      player.canDash = playerState.canDash;
    }

    const disc = this.gameEngine.get<BodyEntity>("disc").values().next().value;
    disc.setPosition(state.disc.x, state.disc.y);
    disc.velocity.x = state.disc.vx;
    disc.velocity.y = state.disc.vy;

    // re simulate (extrapolation)
    const lastInputTime = state.lastInputs.get(this.playerId);
    if (!lastInputTime) return;
    this.reconciliate(lastInputTime);
  }

  // re apply input and re update from synchronization timestamp
  reconciliate(start: number) {
    const player = this.gameEngine.getPlayer(this.playerId);
    if (!player) return;

    let i = 0;
    // console.log("reconciliate");
    for (const data of this.inputs) {
      if (data.time === start) {
        this.inputs.splice(0, i);
        if (this.inputs.length > MAX_RESIMU_STEP) {
          this.inputs.splice(0, this.inputs.length - MAX_RESIMU_STEP);
          return;
        }

        // re apply input and re simulate the game
        let last = data.time;
        for (const input of this.inputs) {
          const now = input.time;
          let dt = (now - last) * 0.001;
          last = input.time;
          player.processInput(now, input.inputs);
          this.gameEngine.step(dt, now);
        }

        break;
      }
      i++;
    }
  }
}

export { Predictor };
