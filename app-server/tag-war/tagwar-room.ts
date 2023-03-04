import { Client } from "colyseus";
import { EndGameState } from "../../app-shared/tag-war/state/end-game-state.js";
import { GameState } from "../../app-shared/tag-war/state/game-state.js";
import { TagWarEngine } from "../../app-shared/tag-war/tag-war.js";
import {
  DEFAULT_TAGWAR_STATS,
  TagWarStats,
} from "../../app-shared/tag-war/types.js";
import { InputsData } from "../../app-shared/types/inputs.js";
import { CBuffer } from "../../app-shared/utils/cbuffer.js";
import { GameParams, GameRoom } from "../rooms/game-room.js";
import { OnJoinCommand, OnLeaveCommand, OnSyncCommand } from "./commands.js";

const COINS_PER_LOSE = 10;
const COINS_PER_WIN = 20;

interface UserData {
  inputBuffer: CBuffer<InputsData>;
}

class TagWarRoom extends GameRoom<GameState, TagWarEngine, TagWarStats> {
  onCreate(params: GameParams<TagWarEngine, TagWarStats>) {
    super.onCreate(params);
    this.setState(new GameState());
    console.log("tag war room created");

    this.onMessage("*", (client, type, message) => {
      switch (type) {
        case "input":
          client.userData.inputBuffer.push(message);
          break;
        case "ping":
          client.send("pong");
          break;
        default:
          console.log("invalid message");
          break;
      }
    });
  }

  async onEndGame() {
    console.log("end game from tagwar");
    const endState = new EndGameState(this.gameEngine, this);
    super.endGame(
      endState,
      DEFAULT_TAGWAR_STATS,
      COINS_PER_WIN,
      COINS_PER_LOSE,
    );
  }

  async onJoin(client: Client) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      client: client,
    });
  }

  async onLeave(client: Client, consented: boolean) {
    this.dispatcher.dispatch(new OnLeaveCommand(), {
      client: client,
      consented: consented,
    });
  }

  update(dt: number) {
    // process input one at a time from user's input buffer
    for (const client of this.clients) {
      const data = client.userData as UserData;
      const inputData = data.inputBuffer.shift();
      if (!inputData) continue;
      this.gameEngine.processInput(inputData.inputs, client.id);
    }
    // update the game simulation
    this.gameEngine.fixedUpdate(dt * 0.001);
    // sync and send new state to clients
    this.dispatcher.dispatch(new OnSyncCommand());
  }
}

export { TagWarRoom };
