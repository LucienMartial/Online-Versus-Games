import { Client, matchMaker, Room } from "colyseus";
import { Request } from "express";

class QueueRoom extends Room {
  /** map session id to client id */
  clientsMap: Map<string, string> = new Map();
  alreadyMatched = 0;
  gameName!: string;

  onCreate({ gameName }: { gameName: string }) {
    this.setPatchRate(0);
    this.gameName = gameName;
  }

  onAuth(client: Client, _options: unknown, request: Request) {
    // username, options delete profile and history
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

  async onJoin(_client: Client) {
    console.log(`client joined queue (${this.gameName})`);

    // no matchmaking, not enough players
    if (this.clients.length - this.alreadyMatched <= 1) {
      console.error(
        "not enough players to match",
        this.alreadyMatched,
        this.clients.length,
      );
      return;
    }

    // matchmaking if there is more than 1 player
    // take 2 random players, wait 5 second before matching
    // take the 2 first players
    this.alreadyMatched += 2;
    const randomPlayers = this.clients.sort(() => Math.random() - 0.5);
    const firstClient = randomPlayers[0];
    const secondClient = randomPlayers[1];
    if (!firstClient || !secondClient) return;

    setTimeout(async () => {
      this.alreadyMatched -= 2;
      console.log(`try to match 2 players (${this.gameName})`);

      // check if client still connected
      if (
        !this.clientsMap.has(firstClient.sessionId) ||
        !this.clientsMap.has(secondClient.sessionId)
      ) {
        return;
      }

      // create game, send reservation
      const gameRoom = await matchMaker.createRoom(this.gameName, {});
      const firstReservation = await matchMaker.reserveSeatFor(gameRoom, {});
      const secondReservation = await matchMaker.reserveSeatFor(gameRoom, {});
      firstClient.send("game-found", firstReservation);
      secondClient.send("game-found", secondReservation);
    }, 5000);
  }

  async onLeave(client: Client, _consented: boolean) {
    console.log("client leaved queue");
    this.clientsMap.delete(client.id);
  }
}

export default QueueRoom;
