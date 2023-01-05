import { Command } from "@colyseus/command";
import { GameRoom } from "../game-room.js";
import { PhysicEngine } from "../../app-shared/physics/index.js";

class OnUpdateCommand extends Command<
  GameRoom,
  { dt: number; physicEngine: PhysicEngine }
> {
  execute({ dt, physicEngine } = this.payload) {
    physicEngine.fixedUpdate(dt);
  }
}

export { OnUpdateCommand };
