import { Player } from "../../../../app-shared/disc-war";
import { BoxShape } from "../../../../app-shared/physics";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

const DEFAULT_COLOR = 0x990000;

class PlayerRender extends RenderObject {
  player: Player;

  constructor(player: Player, id: string, color = DEFAULT_COLOR) {
    super(id);

    const shape = player.collisionShape as BoxShape;
    this.player = player;
    const display = Graphics.createRectangle(shape.width, shape.height, color);
    this.addChild(display);
  }

  update(dt: number, now: number) {
    super.update(dt, now);
    this.position.set(this.player.position.x, this.player.position.y);
  }
}

export { PlayerRender };
