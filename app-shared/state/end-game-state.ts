import { Schema, type, MapSchema } from "@colyseus/schema";
import { Client } from "colyseus";
import { GameRoom } from "../../app-server/game-room.js";
import { DiscWarEngine, Player } from "../disc-war/index.js";

// stat
class EndGamePlayerState extends Schema {
  @type("number") deathCounter = 0;
}

class EndGameState extends Schema {
  @type("boolean") victory = false;
  @type("string") hello = "hey";
  @type({ map: EndGamePlayerState }) players =
    new MapSchema<EndGamePlayerState>();

  constructor(engine: DiscWarEngine, client: Client, room: GameRoom) {
    super();
    for (const player of engine.get<Player>("players")) {
      const state = new EndGamePlayerState();
      state.deathCounter = player.deathCounter;
      if (client.id === player.id && player.deathCounter !== room.maxDeath) {
        this.victory = true;
      }
      this.players.set(player.id, state);
    }
  }
}

export { EndGameState, EndGamePlayerState };
