import { Client } from "colyseus";
import { DiscWarEngine } from "../../../app-shared/disc-war/disc-war.js";
import { Request } from "express";
import {
  EndGameState,
  GameState,
} from "../../../app-shared/disc-war/state/index.js";
import {
  OnInputCommand,
  OnJoinCommand,
  OnLeaveCommand,
  OnSyncCommand,
} from "../../commands/index.js";
import { InputsData } from "../../../app-shared/types/index.js";
import { CBuffer } from "../../../app-shared/utils/cbuffer.js";
import {
  COINS_PER_LOSE,
  COINS_PER_WIN,
} from "../../../app-shared/utils/constants.js";
import { GameParams, GameRoom } from "../../rooms/game-room.js";

// maximum number of inputs saved for each client
const MAX_INPUTS = 50;
const MAX_DEATH = 3;

interface UserData {
  inputBuffer: CBuffer<InputsData>;
}

/**
 * Server room for the disc war game
 */
class DiscWarRoom extends GameRoom<GameState, DiscWarEngine> {
  leftId: string | null = null;
  rightId: string | null = null;
  maxDeath = MAX_DEATH;
  maxClients = 2;

  onCreate(params: GameParams<DiscWarEngine>) {
    super.onCreate(params);
    this.setState(new GameState());
    this.gameEngine.maxDeath = this.maxDeath;
    this.gameEngine.paused = true;

    // register event
    this.onMessage("*", (client, type, message) => {
      const baseData = {
        client: client,
        data: message,
      };

      switch (type) {
        case "input":
          this.dispatcher.dispatch(new OnInputCommand(), baseData);
          break;
        // when client is desync, clear his input buffer
        case "desync":
          client.userData.inputBuffer.clear();
          break;
        default:
          console.log("invalid message");
          break;
      }
    });
  }

  async onEndGame() {
    console.log("end game?");
    const endState = new EndGameState(this.gameEngine, this);
    super.endGame(endState, COINS_PER_WIN, COINS_PER_LOSE);
  }

  onJoin(client: Client) {
    // contains username and id by default
    client.userData = {
      inputBuffer: new CBuffer<InputsData>(MAX_INPUTS),
      ...client.userData,
    };
    this.dispatcher.dispatch(new OnJoinCommand(), {
      client: client,
      gameEngine: this.gameEngine,
    });
  }

  async onLeave(client: Client, consented: boolean) {
    this.dispatcher.dispatch(new OnLeaveCommand(), {
      client: client,
      consented: consented,
    });
  }

  // simulation update, 60 hertz
  update(dt: number) {
    // process inputs for each players
    // TODO: verify input before applying it
    for (const client of this.clients) {
      const data = client.userData as UserData;
      const inputData = data.inputBuffer.shift();
      if (!inputData) continue;
      this.gameEngine.processInput(inputData.inputs, client.id);
      this.state.lastInputs.set(client.id, inputData.time);
    }

    // Update the game simulation
    this.gameEngine.fixedUpdate(dt * 0.001);

    // synchronize the sended state with the simulation one
    this.dispatcher.dispatch(new OnSyncCommand(), {
      gameEngine: this.gameEngine,
    });
  }
}

export { DiscWarRoom };
