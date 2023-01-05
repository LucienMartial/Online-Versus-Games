import { Dispatcher } from "@colyseus/command";
import { Client, Room } from "colyseus";
import { PhysicEngine } from "../app-shared/physics";
import { GameState } from "../app-shared/state/game-state.js";
import { OnCreateCommand, OnJoinCommand } from "./commands/index.js";

class GameRoom extends Room<GameState> {
  dispatcher = new Dispatcher(this);
  physicEngine: PhysicEngine;

  onCreate() {
    this.setState(new GameState());
    this.setSimulationInterval((dt: number) => this.update(dt));
    this.dispatcher.dispatch(new OnJoinCommand(), { clientId: "hey" });
    this.dispatcher.dispatch(new OnCreateCommand(), {
      physicEngine: this.physicEngine,
    });
  }

  // verify token, etc..
  async onAuth(client: Client) {
    console.log("client authentication");
    return true;
  }

  onJoin(client: Client) {
    console.log("client joined", client.id);
    this.dispatcher.dispatch(new OnJoinCommand(), { clientId: client.id });
  }

  onLeave(client: Client) {
    console.log("client leaved", client.id);
  }

  onDispose(): void | Promise<any> {
    this.dispatcher.stop();
  }

  // simulation update, 60 hertz
  update(dt: number) {}
}

export { GameRoom };
