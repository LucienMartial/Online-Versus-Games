import { MapSchema, Schema, type } from "@colyseus/schema";
import { TagWarRoom } from "../../../app-server/tag-war/room/tagwar-room.js";
import { TagWarEngine } from "../tag-war.js";

class Stats extends Schema {}

class EndGamePlayerState extends Schema {
  @type("string")
  id = "";
  @type("string")
  username = "";
  @type("boolean")
  victory = false;
  @type(Stats)
  stats = new Stats();
}

class EndGameState extends Schema {
  @type({ map: EndGamePlayerState })
  players = new MapSchema<EndGamePlayerState>();

  constructor(engine: TagWarEngine, room: TagWarRoom) {
    super();
    // todo: fetch darta from engine, populate state
  }
}

export { EndGameState };
