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
import { PlayerRender } from "./renderer/player-render";
import { CBuffer } from "../../../app-shared/utils";
import { MapRender } from "./renderer/map-render";
import { Container } from "pixi.js";
import { DeathAnimManager } from "../disc-war/effects/death-anim-manager";
import { Emitter } from "pixi-particles";
import { DEATH_ANIMATION } from "../disc-war/effects/configs/death-anim-config";

class TagWarScene extends GameScene<GameState> {
  gameEngine: TagWarEngine;
  mainPlayer: Player;
  mainPlayerRender!: PlayerRender;
  cosmeticsAssets!: CosmeticAssets;
  mapFiltered: Container;
  mapRender!: MapRender;
  lastPingTime: Date = new Date();
  pingInterval: number = 0;
  averagePingBuffer: CBuffer<number> = new CBuffer(50);
  receive: boolean = false;
  deathAnimManager!: DeathAnimManager;
  lastFrame: Date = new Date();
  averageFps: number = 0;
  averageFpsBuffer: CBuffer<number> = new CBuffer(50);

  constructor(
    viewport: Viewport,
    sceneElement: HTMLElement,
    client: Client,
    room: Room<GameState>,
  ) {
    super(viewport, sceneElement, client, room);
    this.gameEngine = new TagWarEngine(false, this.id);
    this.mainPlayer = this.gameEngine.addPlayer(this.id, true);
    this.mapFiltered = new Container();
  }

  async load(): Promise<void> {
    this.cosmeticsAssets = await Assets.loadBundle("cosmetics");
    const animationsAssets = await Assets.loadBundle("animations");

    this.mapFiltered = new Container();
    this.mapFiltered.sortableChildren = true;

    // death animation
    const deathAnimContainer = new Container();
    deathAnimContainer.zIndex = 50;
    this.mapFiltered.addChild(deathAnimContainer);
    const deathEmitter = new Emitter(
      deathAnimContainer,
      animationsAssets.red_drop,
      DEATH_ANIMATION.CONFIG_3,
    );
    this.deathAnimManager = new DeathAnimManager(this.gameEngine, deathEmitter);

    // room events
    this.room.onStateChange.once(this.initGame.bind(this));
    this.room.state.players.onAdd = this.addPlayer.bind(this);
    this.room.state.players.onRemove = this.removePlayer.bind(this);
    this.room.onStateChange(this.sync.bind(this));

    // ping
    this.room.onMessage("pong", () => {
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
      this.receive = false;
    });

    // error with room
    this.room.onError((code, message) => {
      console.log("error occured:", code, message);
    });
  }

  destroy() {
    Assets.unload("cosmetics");
    Assets.unload("animations");
    super.destroy();
  }

  // run 1 time when the game start and get server state
  initGame(state: GameState) {
    // init map
    this.mapRender = new MapRender(this.gameEngine, state.mapConfigId);
    this.mapRender.wallsContainer.zIndex = 20;
    this.add(this.mapRender, true);
    this.mapFiltered.addChild(this.mapRender.wallsContainer);
    this.stage.addChild(this.mapFiltered);

    // init main player
    this.mainPlayerRender = new PlayerRender(
      this.mainPlayer,
      this.id,
      this.cosmeticsAssets,
      this.deathAnimManager,
      true,
      this.stage,
    );
    this.mainPlayerRender.container.zIndex = 10;
    this.mainPlayerRender.container.sortableChildren = true;
    this.add(this.mainPlayerRender, false);
    this.mapFiltered.addChild(this.mainPlayerRender.container);

    // init players
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

    // compute time since last frame
    let nowFrame = new Date();
    let fps = 1000 / (nowFrame.getTime() - this.lastFrame.getTime());
    this.averageFpsBuffer.push(fps);
    this.lastFrame = nowFrame;

    // compute average fps
    this.averageFps = 0;
    const fpsArray = this.averageFpsBuffer.toArray();
    for (const fps of fpsArray) {
      this.averageFps += fps;
    }
    this.averageFps /= fpsArray.length;

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
    const player = this.gameEngine.addPlayer(id, false);
    this.setupPlayerCosmetics(player, state.cosmetic);
    const playerRender = new PlayerRender(
      player,
      id,
      this.cosmeticsAssets,
      this.deathAnimManager,
    );
    playerRender.container.zIndex = 9;
    this.add(playerRender, false);
    this.mapFiltered.addChild(playerRender.container);
  }

  removePlayer(_state: PlayerState, id: string) {
    console.log("leaved");
    if (this.id === id) return;
    console.log("player with id", id, "leaved the game");
    const object = this.getById(id);
    if (!object) return;
    this.remove(object);
    this.mapFiltered.removeChild(object.container);
  }
}

export { TagWarScene };
