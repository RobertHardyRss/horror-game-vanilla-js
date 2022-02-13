import { GameObject } from "./game-object.js";

export class Barrier extends GameObject {
	constructor(x, y) {
		super(16, 16);
		this.x = x;
		this.y = y;
		this.fillStyle = "grey";
	}
}
