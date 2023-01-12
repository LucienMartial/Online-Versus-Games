import { Schema, type } from "@colyseus/schema";

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

export { DiscState };
