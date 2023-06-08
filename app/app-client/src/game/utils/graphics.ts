import * as PIXI from "pixi.js";
import { LINE_CAP } from "pixi.js";

/**
 * Helper containing basic shape initialization methods
 */
class Graphics {
  static createRectangle(
    width = 100,
    height = 100,
    color = 0x990000,
  ): PIXI.Graphics {
    const obj = new PIXI.Graphics();
    obj.beginFill(color);
    obj.drawRect(0, 0, width, height);
    obj.endFill();
    return obj;
  }

  static createCircle(radius = 100, color = 0x990000): PIXI.Graphics {
    const obj = new PIXI.Graphics();
    obj.beginFill(color);
    obj.drawCircle(0, 0, radius);
    obj.endFill();
    return obj;
  }

  static createHollowCircle(
    radius = 100,
    outline = 10,
    color = 0x990000,
  ): PIXI.Graphics {
    const obj = new PIXI.Graphics();
    obj.lineStyle(outline, color, 1, 0);
    obj.drawCircle(0, 0, radius);
    obj.endFill();
    return obj;
  }

  static createAlignedPolygon(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    height: number,
    color = 0x990000,
  ) {
    const obj = new PIXI.Graphics();
    obj.beginFill(color);
    obj.moveTo(x1, y1);
    obj.lineTo(x2, y2);
    obj.lineTo(x2, y2 + height);
    obj.lineTo(x1, y1 + height);
    obj.endFill();
    return obj;
  }

  static createParallelogram(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    height: number,
    color = 0x990000,
  ) {
    const obj = new PIXI.Graphics();
    obj.beginFill(color);
    obj.moveTo(x1, y1);
    obj.lineTo(x2, y2);
    obj.lineTo(x2 + height / 2, y2 + height);
    obj.lineTo(x1 + height / 2, y1 + height);
    obj.endFill();
    return obj;
  }

  static createLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    thickness = 5,
    color = 0x990000,
    cap = LINE_CAP.ROUND,
  ): PIXI.Graphics {
    const obj = new PIXI.Graphics();
    obj.lineStyle({
      color: color,
      width: thickness,
      cap: cap,
    });
    obj.moveTo(x1, y1);
    obj.lineTo(x2, y2);
    obj.endFill();
    return obj;
  }

  static createMirror(object: PIXI.Graphics, height: number, add = true) {
    const mirror = object.clone();
    mirror.scale.y = -1;
    mirror.tint = 0x555555;
    mirror.pivot.y = height;
    mirror.alpha = 0.3;
    mirror.zIndex = -1;
    if (add) object.addChild(mirror);
    return mirror;
  }
}

export { Graphics };
