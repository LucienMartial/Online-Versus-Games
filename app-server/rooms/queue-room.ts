import { Client, Room } from "colyseus";
import { Request } from "express";

class QueueRoom extends Room {
  /** map session id to client id */
  clientsMap: Map<string, string> = new Map();

  onCreate() {
    this.setPatchRate(0);
  }

  onAuth(client: Client, options: unknown, request: Request) {
    // nom, username, options delete profile and history
    if (!request.session || !request.session.authenticated) return false;

    // check if already in a room
    const id = request.session.id;
    const username = request.session.username;
    const alreadyExist = [...this.clientsMap.values()].includes(id);
    if (!username || !id || alreadyExist) {
      return false;
    }
    // add username
    this.clientsMap.set(client.id, id);
    console.log("queue: client authenticated", username, id);
    return true;
  }

  onJoin(client: Client): void | Promise<any> {
    console.log("client joined queue");
  }

  async onLeave(client: Client, consented: boolean) {
    console.log("client leaved queue");
    this.clientsMap.delete(client.id);
  }
}

export default QueueRoom;
