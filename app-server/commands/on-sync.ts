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
    this.state.disc.x = disc.position.x;
    this.state.disc.y = disc.position.y;
    this.state.disc.vx = disc.velocity.x;
    this.state.disc.vy = disc.velocity.y;
    this.state.disc.isAttached = disc.isAttached;
    this.state.disc.attachedPlayer = disc.attachedPlayer
      ? disc.attachedPlayer.id
      : "";

    // players
    for (const player of gameEngine.get<Player>("players")) {
      const playerState = this.state.players.get(player.id);

      // default
      playerState.x = player.position.x;
      playerState.y = player.position.y;
      playerState.isLeft = player.isLeft;
      playerState.isDead = player.isDead;
      playerState.possesDisc = player.possesDisc;

      // dash
      playerState.dashTimer.sync(player.dashTimer);
      playerState.dashCooldownTimer.sync(player.dashCooldownTimer);

      // update state
      this.state.players.set(player.id, playerState);
    }
  }
}

export { OnSyncCommand };
