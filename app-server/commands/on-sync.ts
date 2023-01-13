import { Command } from "@colyseus/command";
import {
  Disc,
  DiscWarEngine,
  Player,
} from "../../app-shared/disc-war/index.js";
import { GameRoom } from "../game-room.js";

interface Data {
  gameEngine: DiscWarEngine;
}

class OnSyncCommand extends Command<GameRoom, Data> {
  execute({ gameEngine } = this.payload) {
    this.state.respawnTimer.sync(gameEngine.respawnTimer);

    // disc
    const disc = gameEngine.getOne<Disc>("disc");
    this.state.disc.sync(disc);

    // players
    for (const player of gameEngine.get<Player>("players")) {
      // update state
      const playerState = this.state.players.get(player.id);
      playerState.sync(player);
      this.state.players.set(player.id, playerState);
    }
  }
}

export { OnSyncCommand };
