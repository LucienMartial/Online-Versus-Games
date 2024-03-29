import SAT from "sat";
import { BodyEntity, Entity } from "../game/index.js";
import { PolylineShape } from "../physics/index.js";

const SIDE_WIDTH_RATIO = 0.71;
const SIDE_HEIGHT_RATIO = 0.6;
export const LINE_THICKNESS = 20;
export const PERSPECTIVE_OFFSET = 25;
export const HOME_WALL_OFFSET = 44;
export const MAP_OFFSET_X = 50;
export const MAP_OFFSET_Y = 30;

class Map extends Entity {
  topLeftWall: BodyEntity;
  topMiddleWall: BodyEntity;
  topRightWall: BodyEntity;
  topWalls: BodyEntity[];
  leftHomeWalls: BodyEntity[];
  rightHomeWalls: BodyEntity[];
  walls: BodyEntity[];
  floor: SAT.Vector[];

  constructor(worldWidth: number, worldHeight: number) {
    super();

    this.walls = [];
    this.topWalls = [];
    this.floor = [];

    const offsetX = MAP_OFFSET_X;
    const offsetY = MAP_OFFSET_Y;
    const top = offsetY;
    const bot = worldHeight - offsetY;
    const left = offsetX;
    const right = worldWidth - offsetX;
    const width = worldWidth - offsetX * 2;
    const height = worldHeight - offsetY * 2;
    const sideWidth = width * SIDE_WIDTH_RATIO;
    const sideHeight = height * SIDE_HEIGHT_RATIO;
    const diagonalWidth = (width - sideWidth) / 2;
    const diagonalHeight = (height - sideHeight) / 2;
    const homeWidth = sideHeight / 3;
    const homeTop = height / 2 - sideHeight / 6 + offsetY;
    const homeBot = height / 2 + sideHeight / 6 + offsetY;

    // bottom walls
    // center
    const botMiddleWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(sideWidth, 0),
      new SAT.Vector(left + diagonalWidth, bot),
    );
    // left
    const botLeftWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(diagonalWidth, diagonalHeight),
      new SAT.Vector(left, bot - diagonalHeight),
    );
    // right
    const botRightWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(diagonalWidth, -diagonalHeight),
      new SAT.Vector(right - diagonalWidth, bot),
    );

    // top walls
    // center
    this.topMiddleWall = this.addWall(
      new SAT.Vector(sideWidth, 0),
      new SAT.Vector(0, 0),
      new SAT.Vector(left + diagonalWidth, top + PERSPECTIVE_OFFSET),
    );
    // left
    this.topLeftWall = this.addWall(
      new SAT.Vector(diagonalWidth, -diagonalHeight),
      new SAT.Vector(0, 0),
      new SAT.Vector(left, top + diagonalHeight + PERSPECTIVE_OFFSET),
    );
    // right
    this.topRightWall = this.addWall(
      new SAT.Vector(diagonalWidth, diagonalHeight),
      new SAT.Vector(0, 0),
      new SAT.Vector(right - diagonalWidth, top + PERSPECTIVE_OFFSET),
    );

    // side walls
    // left
    const leftWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(0, sideHeight),
      new SAT.Vector(left, top + diagonalHeight),
    );
    // right
    const rightWall = this.addWall(
      new SAT.Vector(0, sideHeight),
      new SAT.Vector(0, 0),
      new SAT.Vector(right, top + diagonalHeight),
    );

    // add walls, (top walls handled separatly)
    this.walls.push(botLeftWall);
    this.walls.push(botMiddleWall);
    this.walls.push(botRightWall);
    this.walls.push(rightWall);
    this.walls.push(leftWall);

    // home walls left
    // top left
    const topLeftHomeWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(homeWidth, 0),
      new SAT.Vector(left, homeTop),
      HOME_WALL_OFFSET,
    );

    // bottom left
    const botLeftHomeWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(homeWidth, 0),
      new SAT.Vector(left, homeBot),
      HOME_WALL_OFFSET,
    );

    // home walls right
    // top right
    const topRightHomeWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(homeWidth, 0),
      new SAT.Vector(right - homeWidth, homeTop),
      HOME_WALL_OFFSET,
    );

    // bottom right
    const botRightHomeWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(homeWidth, 0),
      new SAT.Vector(right - homeWidth, homeBot),
      HOME_WALL_OFFSET,
    );

    this.leftHomeWalls = [topLeftHomeWall, botLeftHomeWall];
    this.rightHomeWalls = [topRightHomeWall, botRightHomeWall];

    // add floor
    const offset = 8;
    this.pushFloor(
      botLeftWall,
      LINE_THICKNESS / 2 - offset,
      -LINE_THICKNESS / 2,
    );
    this.pushFloor(
      botRightWall,
      -LINE_THICKNESS / 2 + offset,
      -LINE_THICKNESS / 2,
    );
    this.pushFloor(
      this.topRightWall,
      -LINE_THICKNESS / 2 + offset,
      LINE_THICKNESS / 2 - PERSPECTIVE_OFFSET,
    );
    this.pushFloor(
      this.topLeftWall,
      LINE_THICKNESS / 2 - offset,
      LINE_THICKNESS / 2 - PERSPECTIVE_OFFSET,
    );
  }

  pushFloor(wall: BodyEntity, offsetX = 0, offsetY = 0) {
    const shape = wall.collisionShape as PolylineShape;
    const p1 = shape.p1
      .clone()
      .add(wall.position)
      .add(new SAT.Vector(offsetX, offsetY));
    const p2 = shape.p2
      .clone()
      .add(wall.position)
      .add(new SAT.Vector(offsetX, offsetY));
    this.floor.push(p1);
    this.floor.push(p2);
  }

  addWall(
    p1: SAT.Vector,
    p2: SAT.Vector,
    position: SAT.Vector,
    thickness: number = LINE_THICKNESS,
  ): BodyEntity {
    const wall = new BodyEntity(
      new PolylineShape(p1.x, p1.y, p2.x, p2.y, thickness),
    );
    wall.setPosition(position.x, position.y);
    return wall;
  }
}

export { Map };
