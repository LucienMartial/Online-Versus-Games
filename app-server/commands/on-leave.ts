import { Command } from "@colyseus/command";
import { GameRoom } from "../game-room.js";

class OnLeaveCommand extends Command<GameRoom, { clientId: string }> {
  execute({ clientId } = this.payload) {
    console.log("player leaved");
    this.state.players.delete(clientId);
  }
}

export { OnLeaveCommand };
