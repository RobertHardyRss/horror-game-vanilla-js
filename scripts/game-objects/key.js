//@ts-check
import { GameObject } from "./game-object.js";

export class Key extends GameObject {
	constructor(x, y) {
		super(16, 16, x, y);
		this.fillStyle = "yellow";
		this.isPickedUp = false;
	}

	render() {
		// if I am picked up, return and don't draw anything
		if (this.isPickedUp) return;
		// otherwise do the normal render
		super.render();
	}
}
