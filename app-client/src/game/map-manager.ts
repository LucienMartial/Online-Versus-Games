import { Entity } from "./entities/entity";
import { Map } from "../../../app-shared/map";
import { Graphics } from "./utils/graphics";
import { LineShape } from "../../../app-shared/physics";
import { BodyEntity, RenderEntity } from "./entities";
import { Context } from "./scene";

class MapManager extends Entity {
  walls: RenderEntity[];
  map: Map;

  constructor(ctx: Context) {
    super(ctx);
    this.map = new Map(ctx.width, ctx.height);
    this.walls = [];

    for (const wall of this.map.walls) {
      // rendering
      const shape = wall.collisionShape as LineShape;
      const displayWall = Graphics.createLine(
        shape.p1.x,
        shape.p1.y,
        shape.p2.x,
        shape.p2.y
      );
      const wallEntity = new BodyEntity(ctx, displayWall, shape, true);
      wallEntity.setPosition(wall.position.x, wall.position.y);
      wallEntity.render();
    }
  }

  update(dt: number) {}

  render() {}
}

export { MapManager };
