import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import { DiscWarEngine } from "../../app-shared/disc-war/index.js";
import { GameRoom } from "../game-room.js";

class OnLeaveCommand extends Command<
  GameRoom,
  { client: Client; gameEngine: DiscWarEngine }
> {
  execute({ client, gameEngine } = this.payload) {
    console.log("player leaved", client.id);
    gameEngine.removePlayer(client.id);
    this.state.players.delete(client.id);

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

export { OnLeaveCommand };
