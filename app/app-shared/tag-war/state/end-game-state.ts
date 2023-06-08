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

    for (const client of room.clients) {
      const player = engine.getPlayer(client.id);
      if (!player) continue;
      const state = new EndGamePlayerState();

      state.username = client.userData.username;
      state.id = client.userData.id;
      state.victory = !player.isDead;

      this.players.set(player.id, state);
    }
  }
}

export { EndGamePlayerState, EndGameState };
