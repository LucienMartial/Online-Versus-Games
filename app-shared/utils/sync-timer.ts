import { SyncTimerState } from "../state/sync-timer-state.js";

class SyncTimer {
  ticks: number;
  active: boolean;
  duration: number;
  callback?: Function;
  onActive?: { (ticks: number, duration: number): void };
  onInactive?: { (): void };

  constructor() {
    this.reset();
  }

  reset() {
    this.callback = undefined;
    this.ticks = 0;
    this.duration = 0;
    this.active = false;
  }

  timeout(duration: number, callback: Function | undefined = undefined) {
    this.callback = callback;
    this.duration = duration;
    this.active = true;
  }

  isFinished() {
    return this.ticks >= this.duration;
  }

  sync(state: SyncTimerState) {
    this.ticks = state.ticks;
    this.duration = state.duration;
    this.active = state.active;
    if (!state.active) this.onInactive?.();
  }

  update() {
    if (!this.active) return;
    this.onActive?.(this.ticks, this.duration);
    this.ticks += 1;
    if (this.ticks >= this.duration) {
      this.callback?.();
      this.onInactive?.();
      this.ticks = 0;
      this.active = false;
    }
  }
}

export { SyncTimer };
