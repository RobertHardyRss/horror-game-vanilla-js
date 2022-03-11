//@ts-check

import { GameObject } from "./game-object.js";

export class Door extends GameObject {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {boolean} isVertical
	 */
	constructor(x, y, isVertical) {
		let width = isVertical ? 12 : 48;
		let height = isVertical ? 48 : 12;
		let adjustedX = isVertical ? x + 2 : x - 16;
		let adjustedY = isVertical ? y - 16 : y + 2;

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
