import { Schema, type, MapSchema } from "@colyseus/schema";
import { Client } from "colyseus";
import { GameRoom } from "../../app-server/game-room.js";
import { DiscWarEngine, Player } from "../disc-war/index.js";

// stat
class EndGamePlayerState extends Schema {
  @type("string") username = "";
  @type("number") deathCounter = 0;
  @type("boolean") victory = false;
}

class EndGameState extends Schema {
  @type({ map: EndGamePlayerState }) players =
    new MapSchema<EndGamePlayerState>();

  constructor(engine: DiscWarEngine, room: GameRoom) {
    super();
    for (const player of engine.get<Player>("players")) {
      // player state
      const state = new EndGamePlayerState();
      state.username = room.clientsMap.get(player.id) ?? "";
      state.deathCounter = player.deathCounter;

      // victory
      if (player.deathCounter !== room.maxDeath) {
        state.victory = true;
      }

      // set player in map
      this.players.set(player.id, state);
    }
  }
}

export { EndGameState, EndGamePlayerState };
