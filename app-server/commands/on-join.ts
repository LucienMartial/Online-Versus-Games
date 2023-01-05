import { Command } from "@colyseus/command";
import { GameRoom } from "../game-room.js";
import { Player } from "../../app-shared/state/game-state.js";

class OnJoinCommand extends Command<GameRoom, { clientId: string }> {
  execute({ clientId } = this.payload) {
    console.log("player joined");
    this.state.players.set(clientId, new Player(0, 0));
  }
}

export { OnJoinCommand };
