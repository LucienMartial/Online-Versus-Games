import { Client, Room } from "colyseus.js";
import { Viewport } from "pixi-viewport";
import { Container, DisplayObject } from "pixi.js";
import { RenderObject } from "./renderer";
import { InputManager } from "./utils/inputs";

/**
 * Abstract game scene using colyseus state as generic parameter
 */
abstract class GameScene<T> {
  renderables: Set<RenderObject>;
  stage: Container<DisplayObject>;
  inputManager: InputManager;
  viewport: Viewport;
  client: Client;
  room: Room<T>;
  id: string;

  constructor(viewport: Viewport, sceneElement: HTMLElement, client: Client, room: Room<T>) {
    this.viewport = viewport;
    this.stage = new Container();
    this.stage.sortableChildren = true;
    this.inputManager = new InputManager(viewport, sceneElement);
    this.renderables = new Set<RenderObject>();
    this.client = client;
    this.room = room;
    this.id = this.room.sessionId;
  }

  /**
   * Clean up the scene
   */
  destroy() {
    this.stage.destroy();
  }

  /**
   * Load assets and create game objects
   */
  abstract load(): Promise<void>;

  /**
   * Update logic
   */
  update(dt: number, now: number): void {}

  /**
   * Update renderable objects
   */
  updateRenderables(dt: number, now: number) {
    for (const object of this.renderables.values()) {
      object.update(dt, now);
    }
  }

  // useful functions

  add(object: RenderObject, addContainer = true) {
    object.update(0, 0);
    this.renderables.add(object);
    if (addContainer) this.stage.addChild(object.container);
  }

  remove(object: RenderObject) {
    this.renderables.delete(object);
  }

  removeById(id: string) {
    for (const object of this.renderables.values()) {
      if (object.id === id) {
        this.renderables.delete(object);
        this.stage.removeChild(object.container);
        return;
      }
    }
  }

  getById(id: string): RenderObject | undefined {
    for (const object of this.renderables.values()) {
      if (object.id === id) return object;
    }
  }
}

export { GameScene };
