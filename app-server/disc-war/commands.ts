import { Command } from "@colyseus/command";
import { Disc, Player } from "../../app-shared/disc-war/index.js";
import { DiscWarRoom } from "./room/discwar-room.js";
import { PlayerState } from "../../app-shared/disc-war/state/index.js";
import { Client } from "colyseus";
import { syncCosmetics } from "../utils/commands.js";
import { InputsData } from "../../app-shared/types/inputs.js";

class OnSyncCommand extends Command<DiscWarRoom> {
  execute() {
    // engine
    this.state.sync(this.room.gameEngine);
    // disc
    const disc = this.room.gameEngine.getOne<Disc>("disc");
    this.state.disc.sync(disc);
    // players
    for (const player of this.room.gameEngine.get<Player>("players")) {
      // update state
      const playerState = this.state.players.get(player.id);
      if (!playerState) continue;
      playerState.sync(player);
      this.state.players.set(player.id, playerState);
    }
  }
}

class OnJoinCommand extends Command<DiscWarRoom, { client: Client }> {
  async execute({ client } = this.payload) {
    // new client joined
    console.log("client joined", client.id);
    this.room.nbClient += 1;

    // already on player left
    const isLeft = this.room.leftId === null;
    console.log(this.room.leftId, this.room.rightId, isLeft);
    const player = this.room.gameEngine.addPlayer(client.id, isLeft);
    if (isLeft) this.room.leftId = client.id;
    else this.room.rightId = client.id;

    // player state
    const playerState = new PlayerState();
    playerState.sync(player);
    // sync cosmetics and state
    await syncCosmetics(client, playerState, this.room.dbGetUserShop);
    this.state.players.set(client.id, playerState);
    // check if game can start
    if (this.room.nbClient < this.room.maxClients) return;

    // start game
    this.clock.setTimeout(() => {
      this.room.gameEngine.startGame();
    }, 2000);
  }
}

class OnInputCommand extends Command<
  DiscWarRoom,
  { client: Client; data: InputsData }
> {
  execute({ client, data } = this.payload) {
    client.userData.inputBuffer.push(data);
  }
}

const RECONNECTION_TIME = 5;

class OnLeaveCommand extends Command<
  DiscWarRoom,
  { client: Client; consented: boolean }
> {
  async execute({ client, consented } = this.payload) {
    this.room.nbClient -= 1;
    this.room.clientsMap.delete(client.id);
    console.log("player leaved", client.id);

    // try to reconnect
    try {
      // do not reconnect
      if (this.room.gameEnded) {
        throw new Error("game is finished, no reconnection");
      }
      if (consented) throw new Error("consented leave");
      if (this.room.nbClient <= 0) throw new Error("no players left");

      // reconnection
      await this.room.allowReconnection(client, RECONNECTION_TIME);
      console.log("client reconnected sucessfuly", client.id);
      this.room.nbClient += 1;
    } catch (e) {
      // could not reconnect
      this.room.gameEngine.removePlayer(client.id);
      this.state.players.delete(client.id);
      if (e instanceof Error) {
        console.log("client could not reconnect", e.message);
      }

      // player left or right
      if (client.id === this.room.leftId) {
        this.room.leftId = null;
      } else if (client.id === this.room.rightId) {
        this.room.rightId = null;
      } else {
        console.error("client was in neither side");
      }
    }
  }
}

export { OnInputCommand, OnJoinCommand, OnLeaveCommand, OnSyncCommand };
