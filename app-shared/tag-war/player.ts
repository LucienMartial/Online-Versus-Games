import SAT from "sat";
import { BodyEntity } from "../game/body-entity.js";
import { BoxShape } from "../physics/collision.js";
import { SelectedItems } from "../types/index.js";
import { Inputs } from "../types/inputs.js";
import { PlayerState } from "./state/player-state.js";

export const WIDTH = 100;
export const HEIGHT = 60;

// movement
const MAX_SPEED = 350;
const BOOST_SPEED = 600;

class Player extends BodyEntity {
  private isPuppet: boolean;
  collisionWithOther: boolean;
  boostEnabled: boolean = false;

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

  // get server state and update client player
  sync(state: PlayerState) {
    this.setPosition(state.x, state.y);
    this.collisionWithOther = state.collisionWithOther;
  }

  // will surely need collisions
  onCollision(response: SAT.Response, other: BodyEntity) {
    if (this.isPuppet) return;

    if (!other.static) {
      this.collisionWithOther = true;
      return;
    }

    this.move(-response.overlapV.x, -response.overlapV.y);
  }

  processInput(inputs: Inputs) {
    if (this.isPuppet || this.isDead) return;

    // boost
    if (inputs.keys.space) {
      this.boostEnabled = true;
    } else {
      this.boostEnabled = false;
    }

    // get direction
    this.direction = new SAT.Vector();
    if (inputs.keys.left) this.direction.x -= 1;
    if (inputs.keys.right) this.direction.x += 1;
    if (inputs.keys.up) this.direction.y -= 1;
    if (inputs.keys.down) this.direction.y += 1;

    // do not continue if there is no movement
    if (!(this.direction.len() > 0)) return;

    // move
    this.direction.normalize();
    const SPEED = this.boostEnabled ? BOOST_SPEED : MAX_SPEED;
    const force = this.direction.clone().scale(SPEED);
    this.setVelocity(force.x, force.y);
  }

  update(_dt: number) {
    if (this.isPuppet) return;
    this.collisionWithOther = false;
  }
}

export { Player };
