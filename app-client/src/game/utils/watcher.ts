/**
 * Monitor game boolean and notify when it gets active and inactive
 */
class Watcher {
  onActive?: Function;
  onInactive?: Function;
  triggered: boolean;

  constructor() {
    this.triggered = false;
  }

  watch(value: boolean) {
    if (value && !this.triggered) {
      this.triggered = true;
      this.onActive?.();
    }
    if (!value && this.triggered) {
      this.triggered = false;
      this.onInactive?.();
    }
  }
}

export { Watcher };
