import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/game-room.js";
import { PlayerState } from "../../app-shared/state/index.js";
import { Client } from "colyseus";
import { DiscWarEngine } from "../../app-shared/disc-war/index.js";
import { SelectedItems } from "../../app-shared/types/db-types.js";
import { ObjectId } from "mongodb";

interface Data {
  client: Client;
  gameEngine: DiscWarEngine;
}

class OnJoinCommand extends Command<GameRoom, Data> {
  async execute({ client, gameEngine } = this.payload) {
    // new client joined
    this.room.nbClient += 1;
    console.log("client joined", client.id);

    // already on player left
    const isLeft = this.room.leftId === null;
    console.log(this.room.leftId, this.room.rightId, isLeft);
    const player = gameEngine.addPlayer(client.id, isLeft);
    if (isLeft) this.room.leftId = client.id;
    else this.room.rightId = client.id;

    // player state
    const playerState = new PlayerState();
    playerState.sync(player);

    // get cosmetics
    let cosmetics: SelectedItems = {
      skinID: -1,
      hatID: -2,
      faceID: -3,
    };
    try {
      const objectId = new ObjectId(client.userData.id);
      const userShop = await this.room.dbGetUserShop(objectId);
      if (userShop) {
        cosmetics = userShop.selectedItems;
      }
    } catch (e) {
      if (e instanceof Error)
        console.error("could not fetch cosmetics", e.message);
    }

    // set cosmetics
    console.log("cosmetics for ", client.userData.username, cosmetics);
    playerState.skinID = cosmetics.skinID;
    playerState.hatID = cosmetics.hatID;
    playerState.faceID = cosmetics.faceID;

    // set state
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
