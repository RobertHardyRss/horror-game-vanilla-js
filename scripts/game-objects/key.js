//@ts-check
import { GameObject } from "./game-object.js";
export class Key extends GameObject {
	constructor(x, y) {
		super(16, 16, x, y);
		this.fillStyle = "yellow";
		this.isPickedUp = false;
	}
	render() {
		if (this.isPickedUp) return;
		super.render();
	}
}
