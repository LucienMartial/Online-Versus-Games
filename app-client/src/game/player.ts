import {CollisionObject} from "./game-object";
import {Graphics} from "./graphics";
import {BoxShape} from "../../../app-shared/physics";
import {Context} from "./game-object";

const speed: number = 80;

class Player extends CollisionObject {
    constructor(context: Context) {
        super(context, Graphics.createRectangle(100, 200), new BoxShape(100, 200), false);
    }

    processInput(inputs: { [key: string]: boolean }): void {
        if (this.ctx.inputManager.inputs.space) {
            this.physicObject.velocity.x *= 1.2;
            this.physicObject.velocity.y *= 1.2;
        }
        if (this.ctx.inputManager.inputs.left) this.accelerate(-speed, 0);
        else if (this.ctx.inputManager.inputs.right) this.accelerate(speed, 0);
        if (this.ctx.inputManager.inputs.up) this.accelerate(0, -speed);
        else if (this.ctx.inputManager.inputs.down) this.accelerate(0, speed);
    }

    update(dt: number): void {
        this.processInput(this.ctx.inputManager.inputs);
        super.update(dt);
    }
}

export {Player};