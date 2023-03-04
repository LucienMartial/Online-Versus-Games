import { Assets } from "@pixi/assets";
import { Client, Room } from "colyseus.js";
import { Viewport } from "pixi-viewport";
import { CosmeticState } from "../../../app-shared/state/cosmetic-state";
import { Player } from "../../../app-shared/tag-war/player";
import { PlayerState } from "../../../app-shared/tag-war/state";
import { GameState } from "../../../app-shared/tag-war/state";
import { TagWarEngine } from "../../../app-shared/tag-war/tag-war";
import { InputsData } from "../../../app-shared/types";
import { CosmeticAssets } from "../game/configs/assets-config";
import { GameScene } from "../game/scene";
import { PlayerRender } from "./player-render";
import { CBuffer } from "../../../app-shared/utils";

class TagWarScene extends GameScene<GameState> {
  gameEngine: TagWarEngine;
  mainPlayer: Player;
  mainPlayerRender!: PlayerRender;
  cosmeticsAssets!: CosmeticAssets;
  lastPingTime: Date = new Date();
  pingInterval: number = 0;
  averagePingBuffer: CBuffer<number> = new CBuffer(50);
  receive: boolean = false;

  constructor(
    viewport: Viewport,
    sceneElement: HTMLElement,
    client: Client,
    room: Room<GameState>,
  ) {
    super(viewport, sceneElement, client, room);
    this.gameEngine = new TagWarEngine(false, this.id);
    this.mainPlayer = this.gameEngine.addPlayer(this.id);
  }

  async load(): Promise<void> {
    this.cosmeticsAssets = await Assets.loadBundle("cosmetics");

    // player
    this.mainPlayerRender = new PlayerRender(
      this.mainPlayer,
      this.id,
      this.cosmeticsAssets,
    );
    this.add(this.mainPlayerRender);

    // room events
    this.room.onStateChange.once(this.initGame.bind(this));
    this.room.state.players.onAdd = this.addPlayer.bind(this);
    this.room.state.players.onRemove = this.removePlayer.bind(this);
    this.room.onStateChange(this.sync.bind(this));

    this.room.onMessage("pong", () => {
      this.receive = false;
      const now = new Date();
      const ping = now.getTime() - this.lastPingTime.getTime();
      this.averagePingBuffer.push(ping);
      
      // compute average ping
      this.pingInterval = 0;
      const pingArray = this.averagePingBuffer.toArray();
      for (const ping of pingArray) {
        this.pingInterval += ping;
      }
      this.pingInterval /= pingArray.length;
    });
  }

  destroy() {
    Assets.unload("cosmetics");
    super.destroy();
  }

  // run 1 time when the game start and get server state
  initGame(state: GameState) {
    console.log("basic state");
    for (const [id, playerState] of state.players.entries()) {
      this.addPlayer(playerState, id);
    }
  }

  // run every time server synchronize
  sync(state: GameState) {
    // sync players
    for (const [id, playerState] of state.players.entries()) {
      const player = this.gameEngine.getPlayer(id);
      if (!player) continue;
      player.sync(playerState);
    }
  }

  update(dt: number, now: number) {
    super.update(dt, now);

    // fetch input
    const inputs = this.inputManager.inputs;
    const inputData: InputsData = {
      time: now,
      inputs: inputs,
    };

    // process input
    this.room.send("input", inputData);
    this.gameEngine.processInput(inputData.inputs, this.id);

    // send ping to the room
    if (!this.receive) {
      this.lastPingTime = new Date();
      this.room.send("ping");
      this.receive = true;
    }
  }

  /**
   * Player
   */

  setupPlayerCosmetics(player: Player, cosmetic: CosmeticState) {
    player.cosmetics.faceID = cosmetic.faceID;
    player.cosmetics.skinID = cosmetic.skinID;
    player.cosmetics.hatID = cosmetic.hatID;
  }

  addPlayer(state: PlayerState, id: string) {
    // player already exist
    if (this.id === id) {
      this.setupPlayerCosmetics(this.mainPlayer, state.cosmetic);
      this.mainPlayerRender.cosmetics.loadCosmetics(this.mainPlayer.cosmetics);
      return;
    }
    if (this.gameEngine.getPlayer(id)) return;
    // add player
    console.log("new player with id", id, "joined the game");
    const player = this.gameEngine.addPlayer(id);
    this.setupPlayerCosmetics(player, state.cosmetic);
    const playerRender = new PlayerRender(player, id, this.cosmeticsAssets);
    this.add(playerRender, true);
  }

  removePlayer(_state: PlayerState, id: string) {
    console.log("leaved");
    if (this.id === id) return;
    console.log("player with id", id, "leaved the game");
    this.gameEngine.removePlayer(id);
    this.removeById(id);
  }
}

export { TagWarScene };
