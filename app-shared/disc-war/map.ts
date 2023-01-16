import SAT from "sat";
import { BodyEntity, Entity } from "../game/index.js";
import { PolylineShape } from "../physics/index.js";
import { MIDDLE_LINE_ID } from "../utils/constants.js";

const SIDE_WIDTH_RATIO = 0.75;
const SIDE_HEIGHT_RATIO = 0.6;
export const LINE_THICKNESS = 20;
export const PERSPECTIVE_OFFSET = 50;

class Map extends Entity {
  topLeftWall: BodyEntity;
  topMiddleWall: BodyEntity;
  topRightWall: BodyEntity;
  topWalls: BodyEntity[];
  walls: BodyEntity[];
  floor: SAT.Vector[];
  splitLine: BodyEntity;

  constructor(worldWidth: number, worldHeight: number) {
    super();

    this.walls = [];
    this.topWalls = [];
    this.floor = [];
    this.splitLine = new BodyEntity(
      new PolylineShape(0, 0, 0, 0, LINE_THICKNESS)
    );

    const offsetX = 50;
    const offsetY = 30;
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

    // bottom walls
    // center
    const botMiddleWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(sideWidth, 0),
      new SAT.Vector(left + diagonalWidth, bot)
    );
    // left
    const botLeftWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(diagonalWidth, diagonalHeight),
      new SAT.Vector(left, bot - diagonalHeight)
    );
    // right
    const botRightWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(diagonalWidth, -diagonalHeight),
      new SAT.Vector(right - diagonalWidth, bot)
    );

    // top walls
    // center
    this.topMiddleWall = this.addWall(
      new SAT.Vector(sideWidth, 0),
      new SAT.Vector(0, 0),
      new SAT.Vector(left + diagonalWidth, top + PERSPECTIVE_OFFSET)
    );
    // left
    this.topLeftWall = this.addWall(
      new SAT.Vector(diagonalWidth, -diagonalHeight),
      new SAT.Vector(0, 0),
      new SAT.Vector(left, top + diagonalHeight + PERSPECTIVE_OFFSET)
    );
    // right
    this.topRightWall = this.addWall(
      new SAT.Vector(diagonalWidth, diagonalHeight),
      new SAT.Vector(0, 0),
      new SAT.Vector(right - diagonalWidth, top + PERSPECTIVE_OFFSET)
    );

    // side walls
    // left
    const leftWall = this.addWall(
      new SAT.Vector(0, 0),
      new SAT.Vector(0, sideHeight),
      new SAT.Vector(left, top + diagonalHeight)
    );
    // right
    const rightWall = this.addWall(
      new SAT.Vector(0, sideHeight),
      new SAT.Vector(0, 0),
      new SAT.Vector(right, top + diagonalHeight)
    );

    // add walls, (top walls handled separatly)
    this.walls.push(botLeftWall);
    this.walls.push(botMiddleWall);
    this.walls.push(botRightWall);
    this.walls.push(rightWall);
    this.walls.push(leftWall);

    // add floor
    this.pushFloor(botLeftWall);
    this.pushFloor(botMiddleWall);
    this.pushFloor(botRightWall);
    this.pushFloor(rightWall);
    this.pushFloor(this.topRightWall);
    this.pushFloor(this.topMiddleWall);
    this.pushFloor(this.topLeftWall);

    // split line
    this.addSplitLine(
      new SAT.Vector(0, 0),
      new SAT.Vector(0, bot - top),
      new SAT.Vector(worldWidth / 2, top),
      LINE_THICKNESS
    );
  }

  pushFloor(wall: BodyEntity) {
    const shape = wall.collisionShape as PolylineShape;
    const p1 = shape.p1.clone().add(wall.position);
    const p2 = shape.p2.clone().add(wall.position);
    this.floor.push(p1);
    this.floor.push(p2);
  }

  addWall(
    p1: SAT.Vector,
    p2: SAT.Vector,
    position: SAT.Vector,
    thickness: number = LINE_THICKNESS
  ): BodyEntity {
    const wall = new BodyEntity(
      new PolylineShape(p1.x, p1.y, p2.x, p2.y, thickness)
    );
    wall.setPosition(position.x, position.y);
    return wall;
  }

  addSplitLine(
    p1: SAT.Vector,
    p2: SAT.Vector,
    position: SAT.Vector,
    thickness: number
  ) {
    const splitLine = new BodyEntity(
      new PolylineShape(p1.x, p1.y, p2.x, p2.y, thickness),
      true,
      MIDDLE_LINE_ID
    );
    splitLine.setPosition(position.x, position.y);
    this.splitLine = splitLine;
  }
}

export { Map };
