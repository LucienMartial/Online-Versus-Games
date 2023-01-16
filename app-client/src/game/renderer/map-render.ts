import { BodyEntity } from "../../../../app-shared/game";
import { PolylineShape } from "../../../../app-shared/physics";
import { Graphics } from "../utils/graphics";
import { RenderObject } from "./render-object";
import { DiscWarEngine, Map } from "../../../../app-shared/disc-war";
import * as PIXI from "pixi.js";
import { PERSPECTIVE_OFFSET } from "../../../../app-shared/disc-war";
import { Vector } from "sat";

// size
const TOP_WALL_HEIGHT = 138;
const TOP_WALL_BOTTOM_HEIGHT = 5;
const TOP_WALL_OFFSET = 4;

// colors
const WALL_COLOR = 0xaaaaaa;
const TOP_WALL_COLOR = 0x666666;
const TOP_WALL_SIDE_COLOR = 0x555555;
const TOP_WALL_BOTTOM_COLOR = 0x333333;
const FLOOR_COLOR = 0x994433;
const SPLIT_LINE_COLOR = 0x00ff00;

class MapRender extends RenderObject {
  constructor(engine: DiscWarEngine) {
    super();
    const map = engine.getOne<Map>("map");

    // floor
    const floor = structuredClone(map.floor);
    this.renderFloor(floor);

    // top left
    this.renderTopWall(
      map.topLeftWall,
      TOP_WALL_HEIGHT,
      TOP_WALL_SIDE_COLOR,
      TOP_WALL_OFFSET,
      0
    );
    // top right
    this.renderTopWall(
      map.topRightWall,
      TOP_WALL_HEIGHT,
      TOP_WALL_SIDE_COLOR,
      -TOP_WALL_OFFSET,
      0
    );
    // top center
    this.renderTopWall(
      map.topMiddleWall,
      TOP_WALL_HEIGHT,
      TOP_WALL_COLOR,
      0,
      -TOP_WALL_OFFSET
    );

    // split line
    this.renderWall(map.splitLine, 0, SPLIT_LINE_COLOR);

    // normal walls
    for (const wall of map.walls) {
      this.renderWall(wall);
    }

    // top walls
    this.renderWall(map.topLeftWall, -PERSPECTIVE_OFFSET);
    this.renderWall(map.topRightWall, -PERSPECTIVE_OFFSET);
    this.renderWall(map.topMiddleWall, -PERSPECTIVE_OFFSET);
  }

  renderFloor(floor: Vector[]) {
    const obj = new PIXI.Graphics();
    obj.beginFill(FLOOR_COLOR);
    const first = floor.shift()!;
    obj.moveTo(first.x, first.y);
    for (const point of floor) {
      obj.lineTo(point.x, point.y);
    }
    obj.endFill;
    this.addChild(obj);
  }

  // height = 100, thickness = 20, color 0xff0000
  renderTopWall(
    wall: BodyEntity,
    height: number,
    color: number,
    offset: number,
    widthOffset: number
  ) {
    const shape = wall.collisionShape as PolylineShape;
    const p1 = shape.p1;
    const p2 = shape.p2;
    const innerWall = Graphics.createAlignedPolygon(
      p1.x + widthOffset,
      p1.y,
      p2.x - widthOffset,
      p2.y,
      height - TOP_WALL_BOTTOM_HEIGHT,
      color
    );
    const bottomWall = Graphics.createAlignedPolygon(
      p1.x + widthOffset,
      p1.y,
      p2.x - widthOffset,
      p2.y,
      TOP_WALL_BOTTOM_HEIGHT,
      TOP_WALL_BOTTOM_COLOR
    );
    innerWall.position.set(
      wall.position.x + offset,
      wall.position.y - PERSPECTIVE_OFFSET
    );
    bottomWall.position.set(
      wall.position.x + offset,
      wall.position.y - PERSPECTIVE_OFFSET + height - TOP_WALL_BOTTOM_HEIGHT
    );
    this.addChild(bottomWall);
    this.addChild(innerWall);
  }

  renderWall(wall: BodyEntity, offset = 0, color = WALL_COLOR) {
    const shape = wall.collisionShape as PolylineShape;
    const displayLine = Graphics.createLine(
      shape.p1.x,
      shape.p1.y + offset,
      shape.p2.x,
      shape.p2.y + offset,
      shape.thickness,
      color
    );
    displayLine.position.set(wall.position.x, wall.position.y);
    this.addChild(displayLine);
  }
}

export { MapRender };
