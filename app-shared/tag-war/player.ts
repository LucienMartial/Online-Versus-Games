import SAT from "sat";
import { BodyEntity } from "../game/body-entity.js";
import { BoxShape } from "../physics/collision.js";
import { SelectedItems } from "../types/index.js";
import { Inputs } from "../types/inputs.js";
import { PlayerState } from "./state/player-state.js";
import { HOME_WALL_OFFSET, MAP_OFFSET_X, MAP_OFFSET_Y } from "./map.js";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../utils/constants.js";

export const WIDTH = 60;
export const HEIGHT = 60;

// movement
const MAX_SPEED = 350;
const BOOST_SPEED = 600;

// thief position
const THIEF_X = MAP_OFFSET_X + HOME_WALL_OFFSET * 1.8;
const THIEF_Y = WORLD_HEIGHT / 2;

// police position
const COP_X = WORLD_WIDTH - MAP_OFFSET_X - HOME_WALL_OFFSET * 1.8;
const COP_Y = WORLD_HEIGHT / 2;

class Player extends BodyEntity {
  private isPuppet: boolean;
  collisionWithOther: boolean;
  boostEnabled: boolean = false;
  isThief: boolean;
  touchedCallback: Function;

  // cosmetics
  cosmetics: SelectedItems;

  // movement
  direction: SAT.Vector;

  constructor(
    id: string,
    isPuppet: boolean,
    isThief: boolean,
    touchedCallback: Function,
  ) {
    const collisionShape = new BoxShape(WIDTH, HEIGHT);
    super(collisionShape, false, id);
    this.setOffset(WIDTH / 2, HEIGHT / 2);
    this.isPuppet = isPuppet;
    this.friction = new SAT.Vector();
    this.direction = new SAT.Vector();
    this.collisionWithOther = false;
    this.isThief = isThief;

    // callbacks
    this.touchedCallback = touchedCallback;

    if (!this.isPuppet) console.log("player created", this.id, this.isThief);

    // set position
    if (this.isThief) {
      this.setPosition(THIEF_X, THIEF_Y);
    } else {
      this.setPosition(COP_X, COP_Y);
    }

    // cosmetics
    this.cosmetics = { skinID: -1, hatID: -2, faceID: -3 };
  }

  // get server state and update client player
  sync(state: PlayerState) {
    this.setPosition(state.x, state.y);
    this.collisionWithOther = state.collisionWithOther;
    this.isThief = state.isThief;
  }

  // will surely need collisions
  onCollision(response: SAT.Response, other: BodyEntity) {
    if (this.isPuppet) return;

    if (!other.static) {
      this.collisionWithOther = true;
      this.touchedCallback(this);
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
