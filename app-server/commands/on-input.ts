import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import { InputsData } from "../../app-shared/types/inputs.js";
import { DiscWarRoom } from "../disc-war/room/game-room.js";

interface Data {
  client: Client;
  data: InputsData;
}

class OnInputCommand extends Command<DiscWarRoom, Data> {
  execute({ client, data } = this.payload) {
    client.userData.inputBuffer.push(data);
  }
}

export { OnInputCommand };
