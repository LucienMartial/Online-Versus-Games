import { Client, Room } from "colyseus";
import { Request } from "express";
import { ServerMessage } from "../../app-shared/types/index.js";

class ChatRoom extends Room {
  clientsMap: Map<string, string> = new Map();

  onCreate() {
    this.setPatchRate(0);
    this.onMessage("message", (client, message) => {
      const serverMessage: ServerMessage = {
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
    const alreadyExist = [...this.clientsMap.values()].includes(username);
    if (!username || alreadyExist) {
      return false;
    }
    // add username
    this.clientsMap.set(client.id, request.session.username);
    return true;
  }

  onLeave(client: Client, consented: boolean) {
    const serverMessage: ServerMessage = {
      content: `${this.clientsMap.get(client.id)} left the chat`,
      sender: "server",
      date: new Date(),
    };
    this.broadcast("message", serverMessage);
    this.clientsMap.delete(client.id);
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
