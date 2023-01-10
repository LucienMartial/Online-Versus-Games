import { Player } from "../../../../app-shared/disc-war";
import { BoxShape } from "../../../../app-shared/physics";
import { lerp } from "../../../../app-shared/utils";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

class PlayerRender extends RenderObject {
  player: Player;

  constructor(player: Player, id: string, color = 0x990000) {
    super(id);

    const shape = player.collisionShape as BoxShape;
    this.player = player;
    const display = Graphics.createRectangle(shape.width, shape.height, color);
    this.addChild(display);
  }

  update(dt: number, now: number) {
    const lerpPower = 1;
    this.position.x = lerp(this.position.x, this.player.position.x, lerpPower);
    this.position.y = lerp(this.position.y, this.player.position.y, lerpPower);
  }
}

export { PlayerRender };
