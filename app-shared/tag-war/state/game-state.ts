import { MapSchema, Schema, type } from "@colyseus/schema";
import { TagWarEngine } from "../tag-war.js";
import { PlayerState } from "./player-state.js";

class GameState extends Schema {
  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();

  sync(_engine: TagWarEngine) {}
}

export { GameState };
