//@ts-check

import { Game } from "../game.js";
import { GameObject } from "./game-object.js";

export class ExitPortal extends GameObject {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {Game} game
	 */
	constructor(x, y, game) {
		super(32, 32, x, y);
		this.game = game;

		this.hue = 160;
		this.setFillStyle();
	}

	setFillStyle() {
		// update the hue value with each call
		// and reset it to zero if it goes over 360
		if (this.hue > 300) this.hue = 160;
		this.hue += 5; // increasing this number cycles colors faster
		// set the fill style to the current HSLA value
		this.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
	}

	update(elapsedTime) {
		if (this.isColliding(this.game.player)) {
			this.game.isLevelComplete = true;
		}
		this.setFillStyle();
	}
}
