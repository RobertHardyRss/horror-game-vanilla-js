//@ts-check

import { GameObject } from "./game-object.js";

export class Door extends GameObject {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {boolean} isVertical
	 */
	constructor(x, y, isVertical) {
		let adjustedX = isVertical ? x : x - 16;
		let adjustedY = isVertical ? y - 16 : y;
		let width = isVertical ? 16 : 48;
		let height = isVertical ? 48 : 16;
		super(width, height, adjustedX, adjustedY);
		this.isOpen = false;
		this.isLocked = true;
		this.fillStyle = "orange";
	}
	render() {
		if (this.isOpen) return;
		super.render();
	}
}
