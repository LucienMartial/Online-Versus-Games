import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import { InputsData } from "../../app-shared/types/inputs.js";
import { GameRoom } from "../rooms/game-room.js";

interface Data {
  client: Client;
  data: InputsData;
}

class OnInputCommand extends Command<GameRoom, Data> {
  execute({ client, data } = this.payload) {
    client.userData.inputBuffer.push(data);
  }
}

export { OnInputCommand };
