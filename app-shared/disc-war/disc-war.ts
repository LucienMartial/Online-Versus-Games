import { GameEngine } from "../game/game-engine.js";
import { WORLD_HEIGHT, WORLD_WIDTH, Inputs } from "../utils/index.js";
import { BodyEntity } from "../game/index.js";
import { Map, Player } from "./index.js";
import { BoxShape } from "../physics/index.js";
import SAT from "sat";

/**
 * Game logic for disc war
 */
class DiscWarEngine extends GameEngine {
  init() {
    // map
    const map = new Map(WORLD_WIDTH, WORLD_HEIGHT);
    for (const wall of map.walls) this.add("walls", wall);

    // disc
    // TODO: Disc object
    const disc = new BodyEntity(new BoxShape(100, 100), false);
    disc.friction = new SAT.Vector(1, 1);
    disc.setPosition(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    disc.setVelocity(500, 100);
    disc.onCollision = (response: SAT.Response, other: BodyEntity) => {
      disc.velocity.reflectN(response.overlapN.perp());
      disc.position.sub(response.overlapV);
      return;
    };
    this.add("disc", disc);
  }

  addPlayer(id: string): Player {
    const player = new Player(id);
    player.setPosition(WORLD_WIDTH / 3, WORLD_HEIGHT / 2);
    player.onCollision = (response: SAT.Response, other: BodyEntity) => {
      if (!other.static) return;
      player.move(-response.overlapV.x, -response.overlapV.y);
    };
    this.add("players", player);
    return player;
  }

  removePlayer(id: string) {
    this.removeById("players", id);
  }

  getPlayer(id: string): Player | undefined {
    return this.getById<Player>("players", id);
  }

  processInput(inputs: Record<Inputs, boolean>, id: string): void {
    const player = this.getById<Player>("players", id);
    if (!player) return;
    player.processInput(inputs);
  }

  fixedUpdate(dt: number): void {
    super.fixedUpdate(dt);
  }
}

export { DiscWarEngine };
