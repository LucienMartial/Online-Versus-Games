import { Schema, type } from "@colyseus/schema";
import { Disc } from "../disc-war/disc.js";

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

  sync(disc: Disc) {
    this.x = disc.position.x;
    this.y = disc.position.y;
    this.vx = disc.velocity.x;
    this.vy = disc.velocity.y;
    this.isAttached = disc.isAttached;
    this.attachedPlayer = disc.attachedPlayer ? disc.attachedPlayer.id : "";
  }
}

export { DiscState };
