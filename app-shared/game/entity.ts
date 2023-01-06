import SAT from "sat";

class Entity {
  id?: string;
  private _position: SAT.Vector;

  constructor(id = "") {
    this.id = id;
    this._position = new SAT.Vector();
  }

  update(dt: number) {}

  // position
  setPosition(x: number, y: number) {
    this._position.x = x;
    this._position.y = y;
  }

  move(x: number, y: number) {
    this._position.x += x;
    this._position.y += y;
  }

  get position(): SAT.Vector {
    return this._position;
  }
}

export { Entity };
