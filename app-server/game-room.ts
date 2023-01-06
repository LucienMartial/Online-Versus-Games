import { Dispatcher } from "@colyseus/command";
import { Client, Room } from "colyseus";
import { PhysicEngine } from "../app-shared/physics/index.js";
import { GameState } from "../app-shared/state/index.js";
import {
  OnCreateCommand,
  OnJoinCommand,
  OnLeaveCommand,
  OnUpdateCommand,
} from "./commands/index.js";

class GameRoom extends Room<GameState> {
  dispatcher = new Dispatcher(this);
  physicEngine: PhysicEngine;

  onCreate() {
    this.setState(new GameState());
    this.setSimulationInterval((dt: number) => this.update(dt));

    // custom init
    this.physicEngine = new PhysicEngine();
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
    this.dispatcher.dispatch(new OnLeaveCommand(), { clientId: client.id });
    console.log("client leaved", client.id);
  }

  onDispose(): void | Promise<any> {
    this.dispatcher.stop();
  }

  // simulation update, 60 hertz
  update(dt: number) {
    this.dispatcher.dispatch(new OnUpdateCommand(), {
      physicEngine: this.physicEngine,
      dt: dt,
    });
  }
}

export { GameRoom };
