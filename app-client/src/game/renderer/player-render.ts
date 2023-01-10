import { Player } from "../../../../app-shared/disc-war";
import { BoxShape } from "../../../../app-shared/physics";
import { lerp } from "../../../../app-shared/utils";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

const DEFAULT_COLOR = 0x990000;
const POS_LERP = 1;

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
    this.position.x = lerp(this.position.x, this.player.position.x, POS_LERP);
    this.position.y = lerp(this.position.y, this.player.position.y, POS_LERP);
  }
}

export { PlayerRender };
