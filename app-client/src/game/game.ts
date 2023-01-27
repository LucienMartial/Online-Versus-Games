import { Assets } from "@pixi/assets";
import { Container, Sprite, Texture } from "pixi.js";
import { DiscWarEngine } from "../../../app-shared/disc-war/disc-war";
import { Scene } from "./scene";
import { Graphics } from "./utils/graphics";
import { DiscRender, PlayerRender, RenderObject } from "./renderer";
import { Client, Room } from "colyseus.js";
import { GameState, PlayerState } from "../../../app-shared/state";
import {
  InputsData,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../../../app-shared/utils";
import { Predictor } from "./sync/predictor";
import { MapRender } from "./renderer/map-render";
import { Viewport } from "pixi-viewport";
import { Disc, Player } from "../../../app-shared/disc-war";
import { AdvancedBloomFilter } from "@pixi/filter-advanced-bloom";
import { ShockwaveManager } from "./effects/shockwave-manager";
import { DashAnimManager } from "./effects/dash-anim-manager";
import { Emitter } from "pixi-particles";
import { DASH_ANIMATION } from "./effects/configs/dash-anim-config";
import { DEATH_ANIMATION } from "./effects/configs/death-anim-config";
import { DeathAnimManager } from "./effects/death-anim-manager";

const PLAYER_GHOST = false;
const DISC_GHOST = false;
const ANIMATION_ASSETS_PATH = "../assets/animations/";

/**
 * Game scene for the disc war game.
 * Render and manage inputs, all logic is in
 * the disc war game engine class.
 */
class GameScene extends Scene {
  gameEngine: DiscWarEngine;
  mainPlayer: Player;
  predictor: Predictor;
  client: Client;
  room: Room<GameState>;
  id: string;
  mapFiltered: Container;
  lastState?: GameState;
  dashAnimManager!: DashAnimManager;
  deathAnimManager!: DeathAnimManager;

  constructor(
    viewport: Viewport,
    sceneElement: HTMLElement,
    client: Client,
    room: Room<GameState>
  ) {
    super(viewport, sceneElement);
    this.client = client;
    this.room = room;
    this.id = this.room.sessionId;
    this.gameEngine = new DiscWarEngine(false, this.id);
    this.predictor = new Predictor(this.gameEngine, this.id, room);
    this.mainPlayer = this.gameEngine.addPlayer(this.id, true);
    this.mapFiltered = new Container();
  }

  /**
   * Load assets and init objects for the disc game.
   * Do not forget to remove assets loaded in destroy
   */
  async load(): Promise<void> {
    const assets = await Assets.loadBundle("basic");

    // particle effects
    this.dashAnimManager = new DashAnimManager(
      this.gameEngine,
      new Emitter(new Container(), assets.bubble, DASH_ANIMATION.CONFIG_1)
    );

    // death effect
    this.deathAnimManager = new DeathAnimManager(
      this.gameEngine,
      new Emitter(new Container(), assets.bubble, DEATH_ANIMATION.CONFIG_1)
    );

    // filters
    const shockwaveManager = new ShockwaveManager(
      this.gameEngine,
      this.viewport,
      15
    );
    const shockWaveFilters = shockwaveManager.exportShockwaves();

    this.stage.filters = [
      new AdvancedBloomFilter({
        threshold: 0.4,
        quality: 4,
        blur: 4,
      }),
    ];

    for (const filter of shockWaveFilters) {
      this.stage.filters.push(filter);
    }

    this.mapFiltered = new Container();
    this.mapFiltered.sortableChildren = true;

    // particles

    // dash animation
    const dashAnimContainer = new Container();
    this.mapFiltered.addChild(dashAnimContainer);
    const bubbleTexture = Texture.from(ANIMATION_ASSETS_PATH + "bubble.png");
    const dashEmitter = new Emitter(
      dashAnimContainer,
      bubbleTexture,
      DASH_ANIMATION.CONFIG_3
    );
    this.dashAnimManager = new DashAnimManager(this.gameEngine, dashEmitter);

    // death animation
    const deathAnimContainer = new Container();
    // TODO we absolutly have to change that texture
    const redSquareTexture = Texture.from(
      ANIMATION_ASSETS_PATH + "redSquare.png"
    );
    this.mapFiltered.addChild(deathAnimContainer);
    const deathEmitter = new Emitter(
      deathAnimContainer,
      redSquareTexture,
      DEATH_ANIMATION.CONFIG_3
    );
    this.deathAnimManager = new DeathAnimManager(this.gameEngine, deathEmitter);

    // map
    const mapRender = new MapRender(this.gameEngine);
    mapRender.wallsContainer.zIndex = 20;
    this.stage.addChild(mapRender.wallsContainer);
    this.add(mapRender);
    mapRender.splitLineContainer.zIndex = 5;
    this.mapFiltered.addChild(mapRender.splitLineContainer);

    // player are displayed inside the map
    this.mapFiltered.mask = mapRender.floorMask;
    this.mapFiltered.addChild(mapRender.floorMask);
    this.stage.addChild(this.mapFiltered);

    // init character
    const characterRender = new RenderObject();
    characterRender.addChild(new Sprite(assets.character));
    characterRender.setOffset(150, 150);
    characterRender.onUpdate = (dt: number, now: number) => {
      characterRender.rotate(-2.5 * dt);
      characterRender.setPosition(
        WORLD_WIDTH * 0.8,
        WORLD_HEIGHT / 2 + Math.cos(now * 0.001) * 800
      );
    };
    characterRender.update(0, 0);
    this.add(characterRender, false);
    // this.stage.addChild(characterRender.container);

    // ghosts
    let discGhost: RenderObject;
    let playerGhost: RenderObject;
    if (DISC_GHOST) {
      discGhost = new RenderObject();
      discGhost.addChild(Graphics.createCircle(50, 0x0099ff));
      this.add(discGhost, false);
      this.mapFiltered.addChild(discGhost.container);
    }
    if (PLAYER_GHOST) {
      playerGhost = new RenderObject();
      playerGhost.addChild(Graphics.createRectangle(80, 160, 0x0099ff));
      playerGhost.setOffset(40, 80);
      this.add(playerGhost, false);
      this.mapFiltered.addChild(playerGhost.container);
    }

    // main player render
    const mainPlayerRender = new PlayerRender(
      this.mainPlayer,
      this.id,
      this.dashAnimManager,
      this.deathAnimManager,
      this.viewport
    );
    mainPlayerRender.container.zIndex = 10;
    this.add(mainPlayerRender, false);
    this.mapFiltered.addChild(mainPlayerRender.container);

    // disc render
    const disc = this.gameEngine.getOne<Disc>("disc");
    const discRender = new DiscRender(disc, shockwaveManager, this.viewport);
    discRender.container.zIndex = 10;
    this.add(discRender, false);
    discRender.mirror.zIndex = 0;
    this.mapFiltered.addChild(discRender.mirror);
    this.mapFiltered.addChild(discRender.container);

    // init game, add, remove players
    this.room.onStateChange.once((state) => {
      this.lastState = state;
      this.initGame(state);
    });
    this.room.state.players.onAdd = (state, id) => {
      this.addPlayer(id, state);
    };
    this.room.state.players.onRemove = (state, id: string) => {
      this.removePlayer(id);
    };

    // synchronization
    this.room.onStateChange((state: GameState) => {
      this.lastState = state;
      if (PLAYER_GHOST) {
        const player = state.players.get(this.id);
        if (player) playerGhost.setPosition(player.x, player.y);
      }
      if (DISC_GHOST) {
        discGhost.setPosition(state.disc.x, state.disc.y);
      }
      this.predictor.synchronize(state, Date.now());
    });

    // error with room
    this.room.onError((code, message) => {
      console.log("error occured: ", code, message);
    });
  }

  /**
   * Custom destroy, do not forget to unload assets
   */
  destroy() {
    Assets.unload("basic");
    super.destroy();
  }

  /**
   * Synchronize with the server state only one time at the beginning
   */
  initGame(state: GameState) {
    for (const [id, playerState] of state.players.entries()) {
      this.addPlayer(id, playerState);
    }
  }

  /**
   * Add a player it to the game engine and renderer when he joined
   */
  addPlayer(id: string, state: PlayerState) {
    if (this.id === id) return;
    if (this.gameEngine.getById("players", id)) return;
    console.log("new player has joined", id);
    const player = this.gameEngine.getPlayer(id);
    if (!player) {
      const player = this.gameEngine.addPlayer(id, state.isLeft);
      const playerRender = new PlayerRender(
        player,
        id,
        this.dashAnimManager,
        this.deathAnimManager,
        this.viewport,
        0x0099cc
      );
      this.add(playerRender, false);
      this.mapFiltered.addChild(playerRender.container);
    }
  }

  /**
   * Remove player when he leave
   */
  removePlayer(id: string) {
    if (this.id === id) return;
    console.log("player with id", id, "leaved the game");
    this.gameEngine.removePlayer(id);
    const object = this.getById(id);
    if (!object) return;
    this.remove(object);
    this.mapFiltered.removeChild(object.container);
  }

  /**
   * Get player input, send it to server and directly predict next
   * game simulation step
   */
  update(dt: number, now: number) {
    // base update
    super.update(dt, now);

    // current inputs
    const inputs = this.inputManager.inputs;
    const inputData: InputsData = {
      time: now,
      inputs: inputs,
    };
    this.predictor.processInput(inputData);
    this.predictor.predict(dt);
  }
}

export { GameScene };
