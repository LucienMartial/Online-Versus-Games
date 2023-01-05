import { Command } from "@colyseus/command";
import { GameRoom } from "../game-room";

class OnJoinCommand extends Command<GameRoom, { clientId: string }> {
  execute({ clientId } = this.payload) {
    console.log("player joined");
    this.state.msg += clientId;
  }
}

export { OnJoinCommand };
