import { Schema, MapSchema, type } from "@colyseus/schema";
import { DiscWarEngine } from "../index.js";
import { DiscState } from "./disc-state.js";
import { PlayerState } from "./player-state.js";
import { SyncTimerState } from "../../state/sync-timer-state.js";

/**
 * Game data on the server, shared with each clients
 */
class GameState extends Schema {
  @type("boolean") paused = true;
  @type("number") leftScore = 0;
  @type("number") rigthScore = 0;
  @type(SyncTimerState) respawnTimer = new SyncTimerState();
  @type(DiscState) disc = new DiscState();
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type({ map: "number" }) lastInputs = new MapSchema<number>();

  sync(engine: DiscWarEngine) {
    this.paused = engine.paused;
    this.leftScore = engine.leftScore;
    this.rigthScore = engine.rightScore;
    this.respawnTimer.sync(engine.respawnTimer);
  }
}

export { GameState };
