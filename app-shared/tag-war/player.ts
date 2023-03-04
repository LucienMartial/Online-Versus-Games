import SAT from "sat";
import { BodyEntity } from "../game/body-entity.js";
import { BoxShape } from "../physics/collision.js";
import { SelectedItems } from "../types/index.js";
import { Inputs } from "../types/inputs.js";
import { PlayerState } from "./state/player-state.js";

export const WIDTH = 100;
export const HEIGHT = 60;

// movement
const MAX_SPEED = 400;

class Player extends BodyEntity {
  private isPuppet: boolean;
  collisionWithOther: boolean;

  // cosmetics
  cosmetics: SelectedItems;

  // movement
  direction: SAT.Vector;

  constructor(id: string, isPuppet: boolean) {
    const collisionShape = new BoxShape(WIDTH, HEIGHT);
    super(collisionShape, false, id);
    this.setOffset(WIDTH / 2, HEIGHT / 2);
    this.isPuppet = isPuppet;
    this.friction = new SAT.Vector();
    this.direction = new SAT.Vector();
    this.collisionWithOther = false;

    // cosmetics
    this.cosmetics = { skinID: -1, hatID: -2, faceID: -3 };
  }

  sync(state: PlayerState) {
    this.setPosition(state.x, state.y);
    this.collisionWithOther = state.collisionWithOther;
    if (this.collisionWithOther)
      console.log("collision with other");
  }

  // will surely need collisions
  onCollision(response: SAT.Response, other: BodyEntity) {
    if (this.isPuppet) return;

    if (!other.static) {
      this.collisionWithOther = true;
    }
  }

  processInput(inputs: Inputs) {
    if (this.isPuppet || this.isDead) return;

    // get direction
    this.direction = new SAT.Vector();
    if (inputs.keys.left) this.direction.x = -1;
    else if (inputs.keys.right) this.direction.x = 1;
    if (inputs.keys.up) this.direction.y = -1;
    else if (inputs.keys.down) this.direction.y = 1;

    // do not continue if there is no movement
    if (!(this.direction.len() > 0)) return;

    // move
    this.direction.normalize();
    const force = this.direction.clone().scale(MAX_SPEED);
    this.setVelocity(force.x, force.y);
  }

  update(_dt: number) {
    if (this.isPuppet) return;
    this.collisionWithOther = false;
  }
}

export { Player };