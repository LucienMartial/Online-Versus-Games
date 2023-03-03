import { BodyEntity } from "../game/body-entity.js";
import { BoxShape } from "../physics/collision.js";
import { Inputs } from "../types/inputs.js";
import { PlayerState } from "./state/player-state.js";

export const WIDTH = 100;
export const HEIGHT = 60;

class Player extends BodyEntity {
  private isPuppet: boolean;

  constructor(id: string, isPuppet: boolean) {
    const collisionShape = new BoxShape(WIDTH, HEIGHT);
    super(collisionShape, false, id);
    this.setOffset(WIDTH / 2, HEIGHT / 2);
    this.isPuppet = isPuppet;
  }

  sync(state: PlayerState) {
    this.setPosition(state.x, state.y);
  }

  // will surely need collisions
  onCollision(_response: SAT.Response, _other: BodyEntity) {
    if (this.isPuppet) return;
  }

  processInput(_inputs: Inputs) {
    if (this.isPuppet || this.isDead) return;
  }

  update(_dt: number) {
    if (this.isPuppet) return;
  }
}

export { Player };
