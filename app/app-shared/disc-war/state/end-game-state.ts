import { MapSchema, Schema, type } from "@colyseus/schema";
import { DiscWarRoom } from "../../../app-server/disc-war/room/discwar-room.js";
import { DiscWarEngine } from "../index.js";

class Stats extends Schema {
  @type("number")
  deaths = 0;
  @type("number")
  kills = 0;
  @type("number")
  dashes = 0;
  @type("number")
  shields = 0;
  @type("number")
  shieldCatches = 0;
  @type("number")
  straightShots = 0;
  @type("number")
  curveShots = 0;
}

// stat
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

  constructor(engine: DiscWarEngine, room: DiscWarRoom) {
    super();

    // 2 players game
    const players = room.clients.map((client) => engine.getPlayer(client.id));

    for (const client of room.clients) {
      const player = engine.getPlayer(client.id);
      if (!player) continue;
      const otherPlayer = players.find((p) => p?.id !== player.id);
      if (!otherPlayer) continue;

      // player state
      const state = new EndGamePlayerState();
      state.username = client.userData.username;
      state.id = client.userData.id;

      // victory
      state.victory = player.deathCounter !== room.maxDeath;

      // based on other player stats
      state.stats.kills = otherPlayer.deathCounter;

      // stats
      state.stats.deaths = player.deathCounter;
      state.stats.dashes = player.dashCounter;
      state.stats.shields = player.shieldCounter;
      state.stats.shieldCatches = player.successfulShieldCounter;
      state.stats.straightShots = player.straightShotCounter;
      state.stats.curveShots = player.curveShotCounter;

      // set player in map
      this.players.set(player.id, state);
    }
  }
}

export { EndGamePlayerState, EndGameState };
