import { Schema, type } from "@colyseus/schema";

class GameState extends Schema {
  @type("string") msg: string;

  constructor() {
    super();
    this.msg = "";
  }
}

export { GameState };
