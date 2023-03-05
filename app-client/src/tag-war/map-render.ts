import { BodyEntity } from "../../../app-shared/game";
import { PolylineShape } from "../../../app-shared/physics";
import { Graphics } from "../game/utils/graphics";
import { RenderObject } from "../game/renderer/render-object";
import { TagWarEngine, Map } from "../../../app-shared/tag-war";
import * as PIXI from "pixi.js";
import { PERSPECTIVE_OFFSET } from "../../../app-shared/disc-war";
import { Vector } from "sat";
import { Container } from "pixi.js";
import { MAP_COLOR_CONFIGS } from "../game/configs/map-configs";

// walls
const TOP_WALL_HEIGHT = 138;
const TOP_WALL_OFFSET = 4;
// const WALL_COLOR = 0x488cb5;

// colors of walls and floor
const COLOR_CONFIG = MAP_COLOR_CONFIGS.CONFIG_1;

class MapRender extends RenderObject {
  floorMask: PIXI.Graphics;
  wallsContainer: Container;

  constructor(engine: TagWarEngine) {
    super();
    this.wallsContainer = new Container();
    const map = engine.getOne<Map>("map");

    // floor
    const floor = structuredClone(map.floor);
    this.floorMask = this.renderFloor(floor).clone();

    // top left
    this.renderTopWall(
      map.topLeftWall,
      TOP_WALL_HEIGHT,
      COLOR_CONFIG.TOP_WALL_SIDE_COLOR,
      TOP_WALL_OFFSET,
      0
    );
    // top right
    this.renderTopWall(
      map.topRightWall,
      TOP_WALL_HEIGHT,
      COLOR_CONFIG.TOP_WALL_SIDE_COLOR,
      -TOP_WALL_OFFSET,
      0
    );
    // top center
    this.renderTopWall(
      map.topMiddleWall,
      TOP_WALL_HEIGHT,
      COLOR_CONFIG.TOP_WALL_COLOR,
      0,
      -TOP_WALL_OFFSET
    );

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
    obj.beginFill(COLOR_CONFIG.FLOOR_COLOR);
    const first = floor.shift()!;
    obj.moveTo(first.x, first.y);
    for (const point of floor) {
      obj.lineTo(point.x, point.y);
    }
    obj.endFill();
    this.addChild(obj);
    return obj;
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
      height,
      color
    );
    innerWall.position.set(
      wall.position.x + offset,
      wall.position.y - PERSPECTIVE_OFFSET
    );

    // reflection
    const mirror = innerWall.clone();
    mirror.position.y += height;
    mirror.alpha = COLOR_CONFIG.TOP_WALL_REFLECTION;
    mirror.tint = 0x777777;
    innerWall.addChild(mirror);

    this.addChild(innerWall);
  }

  renderWall(wall: BodyEntity, offset = 0) {
    const shape = wall.collisionShape as PolylineShape;
    const displayLine = Graphics.createLine(
      shape.p1.x,
      shape.p1.y + offset,
      shape.p2.x,
      shape.p2.y + offset,
      shape.thickness,
      COLOR_CONFIG.WALL_COLOR
    );
    displayLine.position.set(wall.position.x, wall.position.y);
    this.wallsContainer.addChild(displayLine);
  }
}

export { MapRender };
