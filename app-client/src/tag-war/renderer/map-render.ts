import { BodyEntity } from "../../../../app-shared/game";
import { PolylineShape } from "../../../../app-shared/physics";
import { Graphics } from "../../game/utils/graphics";
import { RenderObject } from "../../game/renderer/render-object";
import { TagWarEngine, Map } from "../../../../app-shared/tag-war";
import * as PIXI from "pixi.js";
import { Vector } from "sat";
import { Container, LINE_CAP } from "pixi.js";
import { MAP_COLOR_CONFIGS } from "../../../../app-shared/tag-war/configs/map-configs";
import { PERSPECTIVE_OFFSET } from "../../../../app-shared/tag-war";

// walls
const TOP_WALL_HEIGHT = 50;
const TOP_WALL_OFFSET = 4;

const HOME_WALL_HEIGHT = 15;

// colors of walls and floor
const DEFAULT_COLOR_CONFIG = MAP_COLOR_CONFIGS.CONFIG_0;

class MapRender extends RenderObject {
  floorMask: PIXI.Graphics;
  wallsContainer: Container;
  colorConfig;

  constructor(engine: TagWarEngine, mapConfigID: number = 0) {
    super();
    this.wallsContainer = new Container();
    const map = engine.getOne<Map>("map");

    switch (mapConfigID) {
      case 0:
        this.colorConfig = MAP_COLOR_CONFIGS.CONFIG_0;
        break;
      case 1:
        this.colorConfig = MAP_COLOR_CONFIGS.CONFIG_1;
        break;
      case 2:
        this.colorConfig = MAP_COLOR_CONFIGS.CONFIG_2;
        break;
      case 3:
        this.colorConfig = MAP_COLOR_CONFIGS.CONFIG_3;
        break;
      default:
        this.colorConfig = DEFAULT_COLOR_CONFIG;
        break;
    }

    // floor
    const floor = structuredClone(map.floor);
    this.floorMask = this.renderFloor(floor).clone();

    // top left
    this.renderTopWall(
      map.topLeftWall,
      TOP_WALL_HEIGHT,
      this.colorConfig.TOP_WALL_SIDE_COLOR,
      TOP_WALL_OFFSET,
      0,
    );
    // top right
    this.renderTopWall(
      map.topRightWall,
      TOP_WALL_HEIGHT,
      this.colorConfig.TOP_WALL_SIDE_COLOR,
      -TOP_WALL_OFFSET,
      0,
    );
    // top center
    this.renderTopWall(
      map.topMiddleWall,
      TOP_WALL_HEIGHT,
      this.colorConfig.TOP_WALL_COLOR,
      0,
      -TOP_WALL_OFFSET,
    );

    // left home walls
    this.renderHomeFakeWalls(
      map.leftHomeWalls,
      HOME_WALL_HEIGHT,
      this.colorConfig.TOP_WALL_COLOR,
    );

    // right home walls
    this.renderHomeFakeWalls(
      map.rightHomeWalls,
      HOME_WALL_HEIGHT,
      this.colorConfig.TOP_WALL_COLOR,
    );

    // normal walls
    for (const wall of map.walls) {
      this.renderWall(wall);
    }

    // top walls
    this.renderWall(map.topLeftWall, -PERSPECTIVE_OFFSET);
    this.renderWall(map.topRightWall, -PERSPECTIVE_OFFSET);
    this.renderWall(map.topMiddleWall, -PERSPECTIVE_OFFSET);

    // left home walls
    for (const wall of map.leftHomeWalls) {
      this.renderHomeWalls(wall, this.colorConfig.WALL_COLOR);
    }

    // right home walls
    for (const wall of map.rightHomeWalls) {
      this.renderHomeWalls(wall, this.colorConfig.WALL_COLOR);
    }
  }

  renderFloor(floor: Vector[]) {
    const obj = new PIXI.Graphics();
    obj.beginFill(this.colorConfig.FLOOR_COLOR);
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
    widthOffset: number,
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
      color,
    );

    innerWall.position.set(
      wall.position.x + offset,
      wall.position.y - PERSPECTIVE_OFFSET,
    );

    this.addChild(innerWall);
  }

  renderHomeFakeWalls(walls: BodyEntity[], height: number, color: number) {
    for (const wall of walls) {
      const shape = wall.collisionShape as PolylineShape;
      const p1 = shape.p1;
      const p2 = shape.p2;
      const innerWall = Graphics.createAlignedPolygon(
        p1.x,
        p1.y,
        p2.x,
        p2.y,
        height,
        color,
      );

      innerWall.position.set(wall.position.x, wall.position.y);

      this.addChild(innerWall);
    }
  }

  renderHomeWalls(
    wall: BodyEntity,
    color: number = this.colorConfig.WALL_COLOR,
  ) {
    const shape = wall.collisionShape as PolylineShape;
    const displayLine = Graphics.createLine(
      shape.p1.x,
      shape.p1.y - shape.thickness / 4,
      shape.p2.x,
      shape.p2.y - shape.thickness / 4,
      shape.thickness / 2,
      color,
      LINE_CAP.BUTT,
    );
    displayLine.position.set(wall.position.x, wall.position.y);
    this.wallsContainer.addChild(displayLine);
  }

  renderWall(
    wall: BodyEntity,
    offset = 0,
    color: number = this.colorConfig.WALL_COLOR,
  ) {
    const shape = wall.collisionShape as PolylineShape;
    const displayLine = Graphics.createLine(
      shape.p1.x,
      shape.p1.y + offset,
      shape.p2.x,
      shape.p2.y + offset,
      shape.thickness,
      color,
    );
    displayLine.position.set(wall.position.x, wall.position.y);
    displayLine.zIndex = 1;
    this.wallsContainer.addChild(displayLine);
  }
}

export { MapRender };
