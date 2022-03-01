//@ts-check
import { ctx } from "../canvas.js";

export class GameObject {
	constructor(w, h, x, y) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.fillStyle = undefined;
		this.lastLocation = new Location(this.x, this.y);
	}

	update(elapsedTime) {
		this.lastLocation.x = this.x;
		this.lastLocation.y = this.y;
		//console.log(this.lastLocation);
	}

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

		if (myBounds.bottom <= oBounds.top) return undefined;
		if (myBounds.top >= oBounds.bottom) return undefined;
		if (myBounds.right <= oBounds.left) return undefined;
		if (myBounds.left >= oBounds.right) return undefined;

		return this.lastLocation;
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

export class Location {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}
