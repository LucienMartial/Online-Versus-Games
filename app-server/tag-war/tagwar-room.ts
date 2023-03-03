import { Client } from "colyseus";
import { Player } from "../../app-shared/tag-war/player.js";
import { EndGameState } from "../../app-shared/tag-war/state/end-game-state.js";
import { GameState } from "../../app-shared/tag-war/state/game-state.js";
import { PlayerState } from "../../app-shared/tag-war/state/player-state.js";
import { TagWarEngine } from "../../app-shared/tag-war/tag-war.js";
import {
  DEFAULT_TAGWAR_STATS,
  TagWarStats,
} from "../../app-shared/tag-war/types.js";
import { InputsData } from "../../app-shared/types/inputs.js";
import { CBuffer } from "../../app-shared/utils/cbuffer.js";
import { GameParams, GameRoom } from "../rooms/game-room.js";

const COINS_PER_LOSE = 10;
const COINS_PER_WIN = 20;
const MAX_INPUTS = 50;
const RECONNECTION_TIME = 10;

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

  onJoin(client: Client) {
    console.log("tagwar: client joined", client.id);
    // contains username and id by default
    client.userData = {
      inputBuffer: new CBuffer<InputsData>(MAX_INPUTS),
      ...client.userData,
    };
    const player = this.gameEngine.addPlayer(client.id);
    const playerState = new PlayerState();
    playerState.sync(player);
    this.state.players.set(client.id, playerState);
    this.nbClient += 1;
  }

  async onLeave(client: Client, consented: boolean) {
    console.log("tagwar: client leaved", client.id);
    this.nbClient -= 1;
    this.clientsMap.delete(client.id);
    try {
      if (consented) throw new Error("consented leave");
      if (this.nbClient <= 0) throw new Error("no players left");
      console.log("wait reconnection");
      await this.allowReconnection(client, RECONNECTION_TIME);
      console.log("client reconnected", client.id);
      this.nbClient += 1;
    } catch (e) {
      console.log("remove player");
      this.gameEngine.removePlayer(client.id);
      this.state.players.delete(client.id);
      if (e instanceof Error) {
        console.log("client could not reconnect", e.message);
      }
    }
  }

  update(dt: number) {
    for (const client of this.clients) {
      const data = client.userData as UserData;
      const inputData = data.inputBuffer.shift();
      if (!inputData) continue;
      this.gameEngine.processInput(inputData.inputs, client.id);
    }

    // update the game simulation
    this.gameEngine.fixedUpdate(dt * 0.001);

    // sync and send new state to clients
    this.state.sync(this.gameEngine);
    for (const player of this.gameEngine.get<Player>("players")) {
      const playerState = this.state.players.get(player.id);
      if (!playerState) continue;
      playerState.sync(player);
      this.state.players.set(player.id, playerState);
    }
  }
}

export { TagWarRoom };
