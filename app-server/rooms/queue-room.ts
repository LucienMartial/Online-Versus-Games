import { Client, Room, matchMaker } from "colyseus";
import { Request } from "express";

class QueueRoom extends Room {
  /** map session id to client id */
  clientsMap: Map<string, string> = new Map();
  alreadyMatched: Set<string> = new Set();

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

  async onJoin(client: Client) {
    console.log("client joined queue");

    // no matchmaking, not enough players
    if (this.clients.length <= 1) return;
    console.log("try to match 2 players");

    // matchmaking if there is more than 1 player
    // take the 2 first players
    const firstClient = this.clients[0];
    const secondClient = this.clients[1];
    if (!firstClient || !secondClient) return;

    // create game, send reservation
    const gameRoom = await matchMaker.createRoom("game", {});
    const firstReservation = await matchMaker.reserveSeatFor(gameRoom, {});
    const secondReservation = await matchMaker.reserveSeatFor(gameRoom, {});
    firstClient.send("game-found", firstReservation);
    secondClient.send("game-found", secondReservation);
  }

  async onLeave(client: Client, consented: boolean) {
    console.log("client leaved queue");
    this.clientsMap.delete(client.id);
  }
}

export default QueueRoom;
