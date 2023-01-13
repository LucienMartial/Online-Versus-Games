import { SyncTimer } from "../utils/index.js";
import { Schema, type } from "@colyseus/schema";

class SyncTimerState extends Schema {
  @type("number") ticks: number;
  @type("number") duration: number;
  @type("boolean") active: boolean;

  constructor() {
    super();
    this.ticks = 0;
    this.active = false;
  }

  sync(timer: SyncTimer) {
    this.ticks = timer.ticks;
    this.active = timer.active;
    this.duration = timer.duration;
  }
}

export { SyncTimerState };
