import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import { GameRoom } from "../rooms/game-room.js";

const RECONNECTION_TIME = 5;

class OnLeaveCommand extends Command<
  GameRoom,
  { client: Client; consented: boolean }
> {
  async execute({ client, consented } = this.payload) {
    this.room.nbClient -= 1;
    this.room.clientsMap.delete(client.id);

    console.log(
      "player leaved",
      client.id,
      "room",
      this.room.roomId,
      "nb players remaining",
      this.room.nbClient
    );
    // this.state.players.get(client.sessionId).connected = false;

    // try to reconnect
    try {
      if (this.room.gameEnded)
        throw new Error("game is finished, no reconnection");
      if (consented) throw new Error("consented leave");
      if (this.room.nbClient <= 0) throw new Error("no players left");

      await this.room.allowReconnection(client, RECONNECTION_TIME);
      console.log("client reconnected sucessfuly", client.id);
      this.room.nbClient += 1;

      // this.state.players.get(client.sessionId).connected = true;
    } catch (e) {
      // could not reconnect
      this.room.gameEngine.removePlayer(client.id);
      this.state.players.delete(client.id);
      console.log("client could not reconnect", e);

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

export { OnLeaveCommand };
