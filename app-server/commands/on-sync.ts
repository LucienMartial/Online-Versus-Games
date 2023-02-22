import { Command } from "@colyseus/command";
import {
  Disc,
  DiscWarEngine,
  Player,
} from "../../app-shared/disc-war/index.js";
import { DiscWarRoom } from "../disc-war/room/game-room.js";

interface Data {
  gameEngine: DiscWarEngine;
}

class OnSyncCommand extends Command<DiscWarRoom, Data> {
  execute({ gameEngine } = this.payload) {
    // engine
    this.state.sync(gameEngine);

    // disc
    const disc = gameEngine.getOne<Disc>("disc");
    this.state.disc.sync(disc);

    // players
    for (const player of gameEngine.get<Player>("players")) {
      // update state
      const playerState = this.state.players.get(player.id);
      if (!playerState) continue;
      playerState.sync(player);
      this.state.players.set(player.id, playerState);
    }
  }
}

export { OnSyncCommand };
