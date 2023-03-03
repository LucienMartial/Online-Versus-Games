import { Client, Room } from "colyseus.js";
import { Viewport } from "pixi-viewport";
import { Player } from "../../../app-shared/tag-war/player";
import { PlayerState } from "../../../app-shared/tag-war/state";
import { GameState } from "../../../app-shared/tag-war/state";
import { TagWarEngine } from "../../../app-shared/tag-war/tag-war";
import { InputsData } from "../../../app-shared/types";
import { GameScene } from "../game/scene";
import { PlayerRender } from "./player-render";

class TagWarScene extends GameScene<GameState> {
  gameEngine: TagWarEngine;
  mainPlayer: Player;
  mainPlayerRender!: PlayerRender;

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
    this.mainPlayerRender = new PlayerRender(this.mainPlayer, this.id);
    this.add(this.mainPlayerRender, true);

    // room events
    this.room.onStateChange.once(this.initGame);
    this.room.state.players.onAdd = this.addPlayer;
    this.room.state.players.onRemove = this.removePlayer;
  }

  destroy() {
    super.destroy();
  }

  initGame(state: GameState) {
    console.log("basic state");
    for (const [id, playerState] of state.players.entries()) {
      this.addPlayer(playerState, id);
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
  }

  /**
   * Player
   */

  addPlayer(_state: PlayerState, id: string) {
    // player already exist
    if (this.id === id) return;
    if (this.gameEngine.getPlayer(id)) return;
    // add player
    console.log("new player with id", id, "joined the game");
    const player = this.gameEngine.addPlayer(id);
    const playerRender = new PlayerRender(player, id);
    this.add(playerRender, true);
  }

  removePlayer(_state: PlayerState, id: string) {
    if (this.id === id) return;
    console.log("player with id", id, "leaved the game");
    this.gameEngine.removePlayer(id);
    const object = this.getById(id);
    if (object) this.remove(object);
  }
}

export { TagWarScene };
