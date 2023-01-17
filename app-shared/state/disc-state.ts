import { Schema, type } from "@colyseus/schema";
import { Disc } from "../disc-war/disc.js";
import { SyncTimerState } from "./sync-timer-state.js";

class DiscState extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") vx: number;
  @type("number") vy: number;
  @type("number") lastSpeed: number;
  @type("boolean") isAttached: boolean;
  @type("string") attachedPlayer: string;
  @type(SyncTimerState) curveTimer: SyncTimerState;

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.lastSpeed = 0;
    this.isAttached = false;
    this.attachedPlayer = "";
    this.curveTimer = new SyncTimerState();
  }

  sync(disc: Disc) {
    this.x = disc.position.x;
    this.y = disc.position.y;
    this.vx = disc.velocity.x;
    this.vy = disc.velocity.y;
    this.lastSpeed = disc.lastSpeed;
    this.isAttached = disc.isAttached;
    this.attachedPlayer = disc.attachedPlayer ? disc.attachedPlayer.id : "";
    // timers
    this.curveTimer.sync(disc.curveTimer);
  }
}

export { DiscState };
