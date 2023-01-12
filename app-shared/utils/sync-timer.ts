import { SyncTimerState } from "../state/sync-timer-state.js";

class SyncTimer {
  ticks: number;
  active: boolean;
  duration: number;
  callback?: Function;

  constructor() {
    this.ticks = 0;
    this.active = false;
    this.duration = 0;
  }

  timeout(duration: number, callback: Function | undefined = undefined) {
    this.callback = callback;
    this.duration = duration;
    this.active = true;
  }

  sync(state: SyncTimerState) {
    this.ticks = state.ticks;
    this.active = state.active;
  }

  update() {
    if (!this.active) return;
    this.ticks += 1;
    if (this.ticks >= this.duration) {
      this.callback?.();
      this.ticks = 0;
      this.active = false;
    }
  }
}

export { SyncTimer };
