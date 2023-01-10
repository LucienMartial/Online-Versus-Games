import { BodyEntity } from "../../../../app-shared/game";
import { LineShape } from "../../../../app-shared/physics";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";

class MapRender extends RenderObject {
  constructor(walls: Set<BodyEntity>) {
    super();

    for (const wall of walls) {
      const shape = wall.collisionShape as LineShape;
      const displayLine = Graphics.createLine(
        shape.p1.x,
        shape.p1.y,
        shape.p2.x,
        shape.p2.y,
        5
      );
      displayLine.position.set(wall.position.x, wall.position.y);
      this.addChild(displayLine);
    }
  }
}

export { MapRender };
