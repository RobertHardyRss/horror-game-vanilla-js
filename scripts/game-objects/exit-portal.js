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
		this.fillStyle = "cyan";
	}

	update(elapsedTime) {
		if (this.isColliding(this.game.player)) {
			this.game.isLevelComplete = true;
		}
	}
}
