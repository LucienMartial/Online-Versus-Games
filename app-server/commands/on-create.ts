import { Command } from "@colyseus/command";
import { GameRoom } from "../game-room";
import { PhysicEngine } from "../../app-shared/physics";

class OnCreateCommand extends Command<
  GameRoom,
  { physicEngine: PhysicEngine }
> {
  execute({ physicEngine } = this.payload) {
    console.log("game creation");
  }
}

export { OnCreateCommand };
