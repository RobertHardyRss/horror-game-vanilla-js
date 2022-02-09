//@ts-check
import { ctx } from "../canvas.js";

export class GameObject {
	constructor(w, h) {
		this.x = 0;
		this.y = 0;
		this.width = w;
		this.height = h;
		this.fillStyle = "";
	}

	update(elapsedTime) {}
	render() {
		ctx.save();
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}

	getBounds() {
		return new ObjectBounds(this.x, this.y, this.width, this.height);
	}

	/**
	 * @param { GameObject } o
	 */
	isColliding(o) {
		let myBounds = this.getBounds();
		let oBounds = o.getBounds();

		if (myBounds.bottom <= oBounds.top) return false;
		if (myBounds.top >= oBounds.bottom) return false;
		if (myBounds.right <= oBounds.left) return false;
		if (myBounds.left >= oBounds.right) return false;
		return true;
	}
}

class ObjectBounds {
	constructor(x, y, w, h) {
		this.top = y;
		this.bottom = y + h;
		this.left = x;
		this.right = x + w;
	}
}
