import { Schema, MapSchema, type } from "@colyseus/schema";

class DashState extends Schema {
  @type("number") timer: number;
  @type("boolean") isDashing: boolean;
  @type("boolean") canDash: boolean;

  constructor(dashTimer = 0, isDashing = false, canDash = true) {
    super();
    this.timer = dashTimer;
    this.isDashing = isDashing;
    this.canDash = canDash;
  }
}

class PlayerState extends Schema {
  @type("boolean") isLeft: boolean;
  @type("boolean") isDead: boolean;
  @type("number") x: number;
  @type("number") y: number;
  @type(DashState) dash: DashState;

  constructor(
    isLeft: boolean,
    isDead: boolean,
    x: number,
    y: number,
    dashState: DashState
  ) {
    super();
    this.isLeft = isLeft;
    this.isDead = isDead;
    this.x = x;
    this.y = y;
    this.dash = dashState;
  }
}

class DiscState extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") vx: number;
  @type("number") vy: number;

  constructor(x: number, y: number, vx: number, vy: number) {
    super();
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }
}

/**
 * Game data on the server, shared with each clients
 */
class GameState extends Schema {
  @type("number") respawnTimer = 0;
  @type("boolean") isRespawning = false;
  @type(DiscState) disc = new DiscState(0, 0, 0, 0);
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type({ map: "number" }) lastInputs = new MapSchema<number>();
}

export { GameState, PlayerState, DiscState, DashState };
