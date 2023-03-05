import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import { Player } from "../../app-shared/tag-war/player.js";
import { PlayerState } from "../../app-shared/tag-war/state/player-state.js";
import { InputsData } from "../../app-shared/types/inputs.js";
import { CBuffer } from "../../app-shared/utils/cbuffer.js";
import { syncCosmetics } from "../utils/commands.js";
import { TagWarRoom } from "./room/tagwar-room.js";

const RECONNECTION_TIME = 10;
const MAX_INPUTS = 2;

class OnSyncCommand extends Command<TagWarRoom> {
  execute() {
    this.state.sync(this.room.gameEngine);
    // sync players
    for (const player of this.room.gameEngine.get<Player>("players")) {
      const playerState = this.state.players.get(player.id);
      if (!playerState) continue;
      playerState.sync(player);
      this.state.players.set(player.id, playerState);
    }
  }
}

class OnJoinCommand extends Command<TagWarRoom, { client: Client }> {
  async execute({ client } = this.payload) {
    console.log("tagwar: client joined", client.id);

    // already on player left
    const isThief = this.room.thiefId === null;
    const player = this.room.gameEngine.addPlayer(client.id, isThief);
    if (isThief) this.room.thiefId = client.id;
    else this.room.copId = client.id;

    // contains username and id by default
    client.userData = {
      inputBuffer: new CBuffer<InputsData>(MAX_INPUTS),
      ...client.userData,
    };
    // create player for user with owned cosmetics
    const playerState = new PlayerState();
    playerState.sync(player);
    await syncCosmetics(client, playerState, this.room.dbGetUserShop);
    this.state.players.set(client.id, playerState);
    this.room.nbClient += 1;

    // check if game can start
    if (this.room.nbClient < this.room.maxClients) return;

    // start game
    this.clock.setTimeout(() => {
      this.room.gameEngine.startGame();
    }, 2000);
  }
}

class OnLeaveCommand extends Command<
  TagWarRoom,
  { client: Client; consented: boolean }
> {
  async execute({ client, consented } = this.payload) {
    console.log("tagwar: client leaved", client.id);
    this.room.nbClient -= 1;
    this.room.clientsMap.delete(client.id);

    try {
      // shall not reconnect
      if (consented) throw new Error("consented leave");
      if (this.room.nbClient <= 0) throw new Error("no players left");
      // try to reconnect
      await this.room.allowReconnection(client, RECONNECTION_TIME);
      console.log("client reconnected", client.id);
      this.room.nbClient += 1;
    } catch (e) {
      // player leaved the game
      this.room.gameEngine.removePlayer(client.id);
      this.state.players.delete(client.id);
      if (e instanceof Error) {
        console.log("client could not reconnect", e.message);
      }
    }
  }
}

export { OnJoinCommand, OnLeaveCommand, OnSyncCommand };
