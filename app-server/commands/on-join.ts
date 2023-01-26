import { Command } from "@colyseus/command";
import { GameRoom } from "../game-room.js";
import { PlayerState } from "../../app-shared/state/index.js";
import { Client } from "colyseus";
import { DiscWarEngine } from "../../app-shared/disc-war/index.js";
import { CBuffer } from "../../app-shared/utils/cbuffer.js";
import { InputsData } from "../../app-shared/types/inputs.js";

interface Data {
  maxInputs: number;
  client: Client;
  gameEngine: DiscWarEngine;
}

class OnJoinCommand extends Command<GameRoom, Data> {
  execute({ maxInputs, client, gameEngine } = this.payload) {
    // new client joined
    this.room.nbClient += 1;
    console.log("client joined", client.id);
    client.userData = {
      inputBuffer: new CBuffer<InputsData>(maxInputs),
    };

    // already on player left
    const isLeft = this.room.leftId === null;
    console.log(this.room.leftId, this.room.rightId, isLeft);
    const player = gameEngine.addPlayer(client.id, isLeft);
    if (isLeft) this.room.leftId = client.id;
    else this.room.rightId = client.id;

    // player state
    const playerState = new PlayerState();
    playerState.sync(player);
    this.state.players.set(client.id, playerState);

    // check if game can start
    if (this.room.nbClient < this.room.maxClients) return;

    // start game
    this.clock.setTimeout(() => {
      this.room.gameEngine.startGame();
    }, 2000);
  }
}

export { OnJoinCommand };
