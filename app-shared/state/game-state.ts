import { Schema, MapSchema, type } from "@colyseus/schema";

class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
}

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export { GameState, Player };
