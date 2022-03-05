import { GameObject, Location } from "./game-object.js";
import { canvas } from "../canvas.js";
export class Barrier extends GameObject {
	constructor(x, y, w, h) {
		super(w, h, x, y);
		this.fillstyle = "brown";
	}
}
