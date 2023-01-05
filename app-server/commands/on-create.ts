import { Command } from "@colyseus/command";
import { GameRoom } from "../game-room.js";
import { PhysicEngine } from "../../app-shared/physics/index.js";
import { Map } from "../../app-shared/map.js";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../../app-shared/constants.js";

class OnCreateCommand extends Command<
  GameRoom,
  { physicEngine: PhysicEngine }
> {
  execute({ physicEngine } = this.payload) {
    // add walls
    const map = new Map(WORLD_WIDTH, WORLD_HEIGHT);
    for (const wall of map.walls) {
      physicEngine.add(wall);
    }
  }
}

export { OnCreateCommand };
