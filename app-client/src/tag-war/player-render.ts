import { BoxShape } from "../../../app-shared/physics";
import { Player } from "../../../app-shared/tag-war/player";
import { RenderObject } from "../game/renderer";
import { Graphics } from "../game/utils/graphics";

class PlayerRender extends RenderObject {
  player: Player;

  constructor(player: Player, id: string) {
    super(id);
    this.player = player;
    const shape = player.collisionShape as BoxShape;
    const display = Graphics.createRectangle(
      shape.width,
      shape.height,
      0xffffff,
    );
    this.addChild(display);
  }

  update(dt: number, now: number) {
    super.update(dt, now);
    this.position.set(this.player.position.x, this.player.position.y);
  }
}

export { PlayerRender };
