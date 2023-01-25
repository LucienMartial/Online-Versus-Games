import { Client, Room } from "colyseus";
import { IncomingMessage } from "http";
import { Request } from "express";

class ChatRoom extends Room {
  clientsMap: Map<string, string> = new Map();

  onCreate() {
    this.setPatchRate(0);
    this.onMessage("message", (client, message) => {
      const serverMessage = {
        content: message.content.trim(),
        sender: this.clientsMap.get(client.id) ?? "hacker",
        date: new Date(),
      };
      this.broadcast("message", serverMessage);
    });
  }

  onAuth(client: Client, options: unknown, request: Request) {
    // nom, username, options delete profile and history
    if (!request.session || !request.session.authenticated) return false;

    // check if already in a room
    const username = request.session.username;
    if (!username || this.clientsMap.has(request.session.username)) {
      return false;
    }
    // add username
    this.clientsMap.set(client.id, request.session.username);
    return true;
  }

  //   onJoin(client) {
  //     this.state.messages.push(`${client.sessionId} joined.`);
  //   }

  // onLeave(client) {
  //   // this.clients.forEach(c => c.send("message", `${client.sessionId} left.`));
  // }

  //   onDispose() {
  //     console.log('Dispose ChatRoom');
  //   }
}

export { ChatRoom };
