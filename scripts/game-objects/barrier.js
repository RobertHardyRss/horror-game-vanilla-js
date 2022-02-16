//@ts-check
import { GameObject } from "./game-object.js";

export class Barrier extends GameObject {
	constructor(x, y, w, h) {
		super(w, h);
		this.x = x;
		this.y = y;
		this.fillStyle = "black";
	}
}
