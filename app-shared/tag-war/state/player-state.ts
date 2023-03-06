import { Schema, type } from "@colyseus/schema";
import { CosmeticState } from "../../state/cosmetic-state.js";
import { Player } from "../player.js";

class PlayerState extends Schema {
  @type("number")
  x: number = 0;
  @type("number")
  y: number = 0;
  @type("boolean")
  collisionWithOther: boolean = false;

  @type("boolean")
  isThief: boolean = false;

  // cosmetics
  @type(CosmeticState)
  cosmetic: CosmeticState = new CosmeticState();

  // get server auhtorative player and update network
  sync(player: Player) {
    this.x = player.position.x;
    this.y = player.position.y;
    this.collisionWithOther = player.collisionWithOther;
    this.isThief = player.isThief;
  }
}

export { PlayerState };
