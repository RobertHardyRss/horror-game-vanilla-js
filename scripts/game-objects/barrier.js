//@ts-check
import { GameObject } from "./game-object.js";

export class Barrier extends GameObject {
	constructor(x, y, w, h) {
		super(w, h, x, y);
		this.fillStyle = "silver";
	}
}
