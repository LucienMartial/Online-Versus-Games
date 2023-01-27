import { Dispatcher } from "@colyseus/command";
import { Client, Room, matchMaker } from "colyseus";
import { DiscWarEngine } from "../app-shared/disc-war/disc-war.js";
import { EndGameState, GameState } from "../app-shared/state/index.js";
import {
  OnJoinCommand,
  OnLeaveCommand,
  OnInputCommand,
  OnSyncCommand,
} from "./commands/index.js";
import { InputsData } from "../app-shared/types/index.js";
import { CBuffer } from "../app-shared/utils/cbuffer.js";
import { Request } from "express";
import { ObjectId } from "mongodb";

// maximum number of inputs saved for each client
const MAX_INPUTS = 50;
interface UserData {
  inputBuffer: CBuffer<InputsData>;
}

const MAX_DEATH = 3;

interface GameParams {
  dbCreateGame: (state: EndGameState) => Promise<void>;
}

/**
 * Server room for the disc war game
 */
class GameRoom extends Room<GameState> {
  dispatcher = new Dispatcher(this);
  gameEngine!: DiscWarEngine;
  leftId: string | null = null;
  rightId: string | null = null;
  nbClient = 0;
  maxDeath = MAX_DEATH;
  gameEnded = false;
  maxClients = 2;
  clientsMap: Map<string, string> = new Map();

  onCreate({ dbCreateGame }: GameParams) {
    this.setState(new GameState());
    this.gameEngine = new DiscWarEngine(true);
    this.gameEngine.maxDeath = this.maxDeath;
    this.gameEngine.paused = true;
    this.setSimulationInterval((dt: number) => this.update(dt), 1000 / 60);
    this.setPatchRate(20);

    // end of game
    this.gameEngine.onEndGame = async () => {
      this.gameEnded = true;
      const chatEndGameRoom = await matchMaker.createRoom("chat-room", {});
      const state = new EndGameState(this.gameEngine, this);
      dbCreateGame(state);
      for (const client of this.clients) {
        const reservation = await matchMaker.reserveSeatFor(
          chatEndGameRoom,
          {}
        );
        client.send("end-game-chat-reservation", reservation);
        client.send("end-game", state);
      }
    };

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
    if (!request.session || !request.session.authenticated) return false;
    // check if already in a room
    const id = request.session.id;
    const username = request.session.username;
    const alreadyExist = [...this.clientsMap.values()].includes(username);
    if (!username || !id || alreadyExist) {
      return false;
    }
    // add username
    this.clientsMap.set(client.id, username);
    console.log("client authenticated", username, id);
    // client data
    client.userData = {
      inputBuffer: new CBuffer<InputsData>(MAX_INPUTS),
      username: username,
      id: id,
    };
    return true;
  }

  onJoin(client: Client) {
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
