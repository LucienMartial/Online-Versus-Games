import { Schema, type, MapSchema } from "@colyseus/schema";
import { GameRoom } from "../../app-server/rooms/game-room.js";
import { DiscWarEngine, Player } from "../disc-war/index.js";

// stat
class EndGamePlayerState extends Schema {
  @type("string") id = "";
  @type("string") username = "";
  @type("boolean") victory = false;
  @type("number") deaths = 0;
  @type("number") kills = 0;
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
      state.kills = otherPlayer.deathCounter;

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
