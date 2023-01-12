import { Command } from "@colyseus/command";
import { DiscWarEngine, Player } from "../../app-shared/disc-war/index.js";
import { BodyEntity } from "../../app-shared/game/body-entity.js";
import {
  DashState,
  DiscState,
  PlayerState,
} from "../../app-shared/state/game-state.js";
import { GameRoom } from "../game-room.js";

interface Data {
  gameEngine: DiscWarEngine;
}

class OnSyncCommand extends Command<GameRoom, Data> {
  execute({ gameEngine } = this.payload) {
    this.state.respawnTimer = gameEngine.respawnTimer.ticks;
    this.state.isRespawning = gameEngine.isRespawning;

    // disc
    const disc = gameEngine.getOne<BodyEntity>("disc");
    this.state.disc = new DiscState(
      disc.position.x,
      disc.position.y,
      disc.velocity.x,
      disc.velocity.y
    );

    // players
    for (const player of gameEngine.get<Player>("players")) {
      const dash = new DashState(
        player.dashTimer.ticks,
        player.isDashing,
        player.canDash
      );
      this.state.players.set(
        player.id,
        new PlayerState(
          player.isLeft,
          player.isDead,
          player.position.x,
          player.position.y,
          dash
        )
      );
    }
  }
}

export { OnSyncCommand };
