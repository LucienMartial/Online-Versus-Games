import { GameEngine } from "../game/game-engine.js";
import { WORLD_HEIGHT, WORLD_WIDTH, Inputs } from "../utils/index.js";
import { BodyEntity } from "../game/index.js";
import { Map, Player } from "./index.js";
import { BoxShape } from "../physics/index.js";

class DiscWarEngine extends GameEngine {
  init() {
    // map
    const map = new Map(WORLD_WIDTH, WORLD_HEIGHT);
    for (const wall of map.walls) this.add("walls", wall);

    // basic box
    const box = new BodyEntity(new BoxShape(100, 200), true);
    box.setOffset(50, 100);
    box.setPosition(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    box.setRotation(Math.PI / 2);
    this.add("boxes", box);
  }

  addPlayer(id: string) {
    const player = new Player(id);
    player.setPosition(WORLD_WIDTH / 3, WORLD_HEIGHT / 2);
    player.accelerate(-300, 300);
    this.add("players", player);
  }

  processInput(inputs: Record<Inputs, boolean>, id: string): void {
    const player = this.getById<Player>("players", id);
    if (!player) return;
    player.processInput(inputs);
  }

  update(dt: number, elapsed: number): void {
    for (const box of this.get<BodyEntity>("boxes")) {
      box.rotate(2 * dt);
      box.move(Math.cos(elapsed) * 2, Math.cos(elapsed * 0.8));
    }

    super.update(dt, elapsed);
  }
}

export { DiscWarEngine };
