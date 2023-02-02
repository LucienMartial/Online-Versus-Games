import { Schema, type } from "@colyseus/schema";
import { Player } from "../disc-war/player.js";
import { SyncTimerState } from "./sync-timer-state.js";

class PlayerState extends Schema {
  @type("boolean") isLeft: boolean;
  @type("boolean") isDead: boolean;
  @type("boolean") possesDisc: boolean;
  @type("number") x: number;
  @type("number") y: number;
  @type(SyncTimerState) dashTimer = new SyncTimerState();
  @type(SyncTimerState) dashCooldownTimer = new SyncTimerState();
  @type(SyncTimerState) counterTimer = new SyncTimerState();
  @type(SyncTimerState) counterCooldownTimer = new SyncTimerState();
  // stat
  @type("number") deathCounter = 0;
  // cosmetics
  @type("number") skinID = 0;
  @type("number") hatID = 0;
  @type("number") faceID = 0;

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.isLeft = true;
    this.isDead = false;
    this.possesDisc = false;
  }

  sync(player: Player) {
    this.x = player.position.x;
    this.y = player.position.y;
    this.isLeft = player.isLeft;
    this.isDead = player.isDead;
    this.possesDisc = player.possesDisc;
    // dash
    this.dashTimer.sync(player.dashTimer);
    this.dashCooldownTimer.sync(player.dashCooldownTimer);
    // counter
    this.counterTimer.sync(player.counterTimer);
    this.counterCooldownTimer.sync(player.counterCooldownTimer);
  }
}

export { PlayerState };
