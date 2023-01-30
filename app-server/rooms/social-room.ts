import { Client, Room } from "colyseus";
import { Request } from "express";
import { SocialState } from "../../app-shared/state/social-state.js";

interface UserData {
  id: string;
  username: string;
}

class SocialRoom extends Room {
  /** map session id to client id */
  userIdMap: Map<string, string> = new Map();
  idClientMap: Map<string, Client> = new Map();

  onCreate() {
    this.setPatchRate(0);
    // this.onMessage("message", (client, message) => {});
    this.onMessage("*", (client, type, message) => {
      const userId = this.userIdMap.get(client.id);
      if (!userId) return;

      switch (type) {
        /**
         * Friend Requests, friends list
         */

        case "request:new":
        case "request:accept":
        case "request:remove":
        case "friend:remove":
          const target = this.idClientMap.get(message);
          console.log(target);
          if (target) target.send(type, userId);
          break;

        /**
         * Ask for current room state
         */

        case "state":
          const state = new SocialState([...this.userIdMap.values()]);
          client.send("state", state);

        default:
          console.error("invalid message in social room");
          break;
      }
    });
  }

  onAuth(client: Client, options: unknown, request: Request) {
    // nom, username, options delete profile and history
    if (!request.session || !request.session.authenticated) return false;

    // check if already in a room
    const id = request.session.id;
    const username = request.session.username;
    const alreadyExist = [...this.userIdMap.values()].includes(id);
    if (!id || !username || alreadyExist) {
      return false;
    }
    // add client id
    this.userIdMap.set(client.id, id);
    this.idClientMap.set(id, client);
    client.userData = { id: id, username: username } satisfies UserData;
    return true;
  }

  onJoin(client: Client): void | Promise<any> {
    console.log(
      "client joined social room",
      client.userData.username,
      client.userData.id
    );

    // connection event
    this.broadcast("connection", client.userData.id, {
      except: client,
    });
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(
      "client leaved social room",
      client.userData.username,
      client.userData.id
    );

    // disconnection event
    this.broadcast("disconnection", client.userData.id, {
      except: client,
    });

    //   try {
    //     if (consented) throw new Error("consented leave");
    //     // get reconnection token
    //     const reconnection = this.allowReconnection(client);
    //     await reconnection;
    //     // client returned! let's re-activate it.
    //     this.state.players.get(client.sessionId).connected = true;
    //   } catch (e) {
    //     // 20 seconds expired. let's remove the client.
    //     this.state.players.delete(client.sessionId);
    //   }

    const userId = this.userIdMap.get(client.id);
    if (userId) this.idClientMap.delete(userId);
    this.userIdMap.delete(client.id);
  }
}

export default SocialRoom;
