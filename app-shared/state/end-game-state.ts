import { Schema, type, MapSchema } from "@colyseus/schema";
import { Client } from "colyseus";
import { ObjectId } from "mongodb";
import { GameRoom } from "../../app-server/game-room.js";
import { DiscWarEngine, Player } from "../disc-war/index.js";

// stat
class EndGamePlayerState extends Schema {
  @type("string") id = "";
  @type("string") username = "";
  @type("boolean") victory = false;
  @type("number") deaths = 0;
  @type("number") dashes = 0;
  @type("number") shields = 0;
  @type("number") shieldCatches = 0;
  @type("number") straightShots = 0;
  @type("number") curveShots = 0;
}

class EndGameState extends Schema {
  @type({ map: EndGamePlayerState }) players =
    new MapSchema<EndGamePlayerState>();

  constructor(engine: DiscWarEngine, room: GameRoom) {
    super();
    for (const client of room.clients) {
      const player = engine.getPlayer(client.id);
      if (!player) continue;
      // player state
      const state = new EndGamePlayerState();
      state.username = client.userData.username;
      state.id = client.userData.id;

      // victory
      state.victory = player.deathCounter !== room.maxDeath;

      // stats
      state.deaths = player.deathCounter;
      state.dashes = player.dashCounter;
      state.shields = player.shieldCounter;
      state.shieldCatches = player.successfulShieldCounter;
      state.straightShots = player.straightShotCounter;
      state.curveShots = player.curveShotCounter;

      // set player in map
      this.players.set(player.id, state);
    }
  }
}

export { EndGameState, EndGamePlayerState };
