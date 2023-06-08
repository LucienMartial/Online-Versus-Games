import { MapSchema, Schema, type } from "@colyseus/schema";
import { TagWarEngine } from "../tag-war.js";
import { PlayerState } from "./player-state.js";
import { SyncTimerState } from "../../state/sync-timer-state.js";

class GameState extends Schema {
  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();

  // map config
  @type("number")
  mapConfigId: number = 0;

  // start timer
  @type(SyncTimerState) respawnTimer = new SyncTimerState();

  // pause
  @type("boolean") paused = true;

  sync(engine: TagWarEngine) {
    this.respawnTimer.sync(engine.respawnTimer);
    this.paused = engine.paused;
  }
}

export { GameState };
