import { Schema, type } from "@colyseus/schema";
import { CosmeticState } from "../../state/cosmetic-state.js";
import { Player } from "../player.js";

class PlayerState extends Schema {
  @type("number")
  x: number;
  @type("number")
  y: number;

  // cosmetics
  @type(CosmeticState)
  cosmetic = new CosmeticState();

  sync(player: Player) {
    this.x = player.position.x;
    this.y = player.position.y;
  }
}

export { PlayerState };
