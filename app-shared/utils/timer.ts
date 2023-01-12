interface Event {
  duration: number;
  callback: Function;
}

/**
 * Rollback oriented Timer that can be synchronized with server
 */
class Timer {
  ticks: number;
  events: Event[];

  constructor() {
    this.ticks = 0;
    this.events = [];
  }

  add(duration: number, callback: Function) {
    this.events.push({ duration: duration, callback: callback });
  }

  clear() {
    this.events = [];
  }

  reset() {
    this.ticks = 0;
  }

  sync(ticks: number) {
    this.ticks = ticks;
  }

  update() {
    this.ticks += 1;
    for (const event of this.events) {
      if (this.ticks >= event.duration) event.callback();
    }
  }
}

export { Timer };
