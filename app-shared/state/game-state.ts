import { Schema, MapSchema, type } from "@colyseus/schema";
import { DiscState } from "./disc-state.js";
import { PlayerState } from "./player-state.js";
import { SyncTimerState } from "./sync-timer-state.js";

/**
 * Game data on the server, shared with each clients
 */
class GameState extends Schema {
  @type(SyncTimerState) respawnTimer = new SyncTimerState();
  @type(DiscState) disc = new DiscState(0, 0, 0, 0);
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type({ map: "number" }) lastInputs = new MapSchema<number>();
}

export { GameState };
