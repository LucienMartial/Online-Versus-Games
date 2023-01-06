import { Command } from "@colyseus/command";
import { GameRoom } from "../game-room.js";
import { PlayerState } from "../../app-shared/state/index.js";

class OnJoinCommand extends Command<GameRoom, { clientId: string }> {
  execute({ clientId } = this.payload) {
    console.log("player joined");
    this.state.players.set(clientId, new PlayerState(0, 0));
  }
}

export { OnJoinCommand };
