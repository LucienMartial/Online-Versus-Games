import { Schema, type } from "@colyseus/schema";
import { SyncTimerState } from "./sync-timer-state.js";

class PlayerState extends Schema {
  @type("boolean") isLeft: boolean;
  @type("boolean") isDead: boolean;
  @type("boolean") possesDisc: boolean;
  @type("number") x: number;
  @type("number") y: number;
  @type(SyncTimerState) dashTimer = new SyncTimerState();
  @type(SyncTimerState) dashCooldownTimer = new SyncTimerState();

  constructor(
    isLeft: boolean,
    isDead: boolean,
    possesDisc: boolean,
    x: number,
    y: number
  ) {
    super();
    this.isLeft = isLeft;
    this.isDead = isDead;
    this.possesDisc = possesDisc;
    this.x = x;
    this.y = y;
  }
}

export { PlayerState };
