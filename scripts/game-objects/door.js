//@ts-check

import { GameObject } from "./game-object.js";

export class Door extends GameObject {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {boolean} isVertical
	 */
	constructor(x, y, isVertical) {
		let width = isVertical ? 16 : 48;
		let height = isVertical ? 48 : 16;
		let adjustedX = isVertical ? x : x - 16;
		let adjustedY = isVertical ? y - 16 : y;

		super(width, height, adjustedX, adjustedY);
		this.fillStyle = "brown";
		this.isOpen = false;
		this.isLocked = true;
	}

	render() {
		// if I am open, don't render the door
		if (this.isOpen) return;
		// otherwise do the normal thing
		super.render();
	}
}
