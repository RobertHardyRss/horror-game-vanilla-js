//@ts-check
import { ctx } from "../canvas.js";

export class GameObject {
	/**
	 * @param {number} w
	 * @param {number} h
	 */
	constructor(w, h) {
		this.x = 0;
		this.y = 0;
		this.width = w;
		this.height = h;
		this.fillStyle = "";
		this.lastLocation = new Location(this.x, this.y);
	}

	/**
	 * @param {number} elapsedTime
	 */
	update(elapsedTime) {
		this.lastLocation.x = this.x;
		this.lastLocation.y = this.y;
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
	 * @param { boolean } optimizeLocation
	 * @returns { Location }
	 */
	isColliding(o, optimizeLocation) {
		let myBounds = this.getBounds();
		let oBounds = o.getBounds();

		// handle simple conditions where I can't be colliding
		if (myBounds.right <= oBounds.left) return undefined;
		if (myBounds.left >= oBounds.right) return undefined;
		if (myBounds.bottom <= oBounds.top) return undefined;
		if (myBounds.top >= oBounds.bottom) return undefined;

		// if we don't care to optimize the ideal location, we can
		// just return the last location and assume it was good
		if (!optimizeLocation) return this.lastLocation;

		// since we are colliding, we need to figure out
		// the best location for us now based on our
		// last good position

		let bestLocation = new Location(this.x, this.y);

		// how far have we moved in the x and y directions
		let locDiff = new LocationDifference(this.x, this.y, this.lastLocation);

		// we need change our position just enough to not be
		// colliding with the other obstacle, so
		// figure out where we are overlapping
		let overlap = new Overlap(myBounds, oBounds);

		if (locDiff.movingUp && overlap.top <= Math.abs(locDiff.yDirection)) {
			// if I am moving up and my top overlap is less than or equal to
			// my vertical rate of speed, then go down by the overlapping amount

			bestLocation.y = this.y + overlap.top;
		} else if (locDiff.movingDown && overlap.bottom <= Math.abs(locDiff.yDirection)) {
			// if I am moving down and my bottom overlap is less than or equal to
			// my vertical rate of speed, then go up by the overlapping amount
			bestLocation.y = this.y - overlap.bottom;
		}

		if (locDiff.movingRight && overlap.right <= Math.abs(locDiff.xDirection)) {
			// if I am moving right and my right overlap is less than or equal to
			// my horizontal rate of speed, then go left by the overlapping amount
			bestLocation.x = this.x - overlap.right;
		} else if (locDiff.movingLeft && overlap.left <= Math.abs(locDiff.xDirection)) {
			// if I am moving left and my left overlap is less than or equal to
			// my horizontal rate of speed, then go right by the overlapping amount
			bestLocation.x = this.x + overlap.left;
		}

		return bestLocation;
	}
}

class Location {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class ObjectBounds {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} w
	 * @param {number} h
	 */
	constructor(x, y, w, h) {
		this.top = y;
		this.bottom = y + h;
		this.left = x;
		this.right = x + w;
	}
}

class LocationDifference {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {Location} lastLocation
	 */
	constructor(x, y, lastLocation) {
		this.xDirection = x - lastLocation.x;
		this.yDirection = y - lastLocation.y;
		this.movingRight = this.xDirection > 0;
		this.movingLeft = this.xDirection < 0;
		this.movingDown = this.yDirection > 0;
		this.movingUp = this.yDirection < 0;
	}
}

class Overlap {
	/**
	 * @param {ObjectBounds} b1
	 * @param {ObjectBounds} b2
	 */
	constructor(b1, b2) {
		let bottomBetween = b1.bottom > b2.top && b1.bottom < b2.bottom;
		let topBetween = b1.top < b2.bottom && b1.top > b2.top;
		let rightBetween = b1.right > b2.left && b1.right < b2.right;
		let leftBetween = b1.left < b2.right && b1.left > b2.left;

		this.top = topBetween ? b2.bottom - b1.top : 0;
		this.bottom = bottomBetween ? b1.bottom - b2.top : 0;
		this.right = rightBetween ? b1.right - b2.left : 0;
		this.left = leftBetween ? b2.right - b1.left : 0;
	}
}
