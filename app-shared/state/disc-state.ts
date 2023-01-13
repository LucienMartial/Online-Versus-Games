import { Schema, type } from "@colyseus/schema";

class DiscState extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") vx: number;
  @type("number") vy: number;
  @type("boolean") isAttached: boolean;
  @type("string") attachedPlayer: string;

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.isAttached = false;
    this.attachedPlayer = "";
  }
}

export { DiscState };
