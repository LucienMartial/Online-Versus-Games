import { Dispatcher } from "@colyseus/command";
import { Client, Room } from "colyseus";
import { DiscWarEngine } from "../app-shared/disc-war/disc-war.js";
import { GameState } from "../app-shared/state/index.js";
import {
  OnJoinCommand,
  OnLeaveCommand,
  OnInputCommand,
  OnSyncCommand,
} from "./commands/index.js";
import { InputsData } from "../app-shared/types/index.js";
import { CBuffer } from "../app-shared/utils/cbuffer.js";
import { Request } from "express";

// maximum number of inputs saved for each client
const MAX_INPUTS = 50;
interface UserData {
  inputBuffer: CBuffer<InputsData>;
}

/**
 * Server room for the disc war game
 */
class GameRoom extends Room<GameState> {
  dispatcher = new Dispatcher(this);
  gameEngine: DiscWarEngine;
  leftId: string | null;
  rightId: string | null;
  nbClient: number;

  onCreate() {
    this.maxClients = 2;
    this.nbClient = 0;
    this.leftId = null;
    this.rightId = null;
    this.setState(new GameState());
    this.gameEngine = new DiscWarEngine(true);
    this.gameEngine.paused = true;
    this.setSimulationInterval((dt: number) => this.update(dt), 1000 / 60);
    this.setPatchRate(20);

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

  // verify token, etc..
  async onAuth(client: Client, options: unknown, request: Request) {
    // check if authentified
    if (!request.session.authenticated) return false;
    console.log(request.session);
    console.log("client authenticated");
    return true;
  }

  onJoin(client: Client) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      maxInputs: MAX_INPUTS,
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

  onDispose(): void | Promise<any> {
    this.dispatcher.stop();
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

export { GameRoom };
