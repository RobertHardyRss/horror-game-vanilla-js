//@ts-check

import { canvas, ctx } from "../canvas.js";
import { Game } from "../game.js";
import { GameObject } from "../game-objects/game-object.js";

export class StartScene extends GameObject {
	/**
	 * @param {Game} game
	 */
	constructor(game) {
		super(canvas.width, canvas.height, 0, 0);
		this.fillStyle = "black";

		this.game = game;
	}

	render() {
		super.render();

		ctx.save();
		ctx.fillStyle = "green";
		ctx.font = "100px zombiecontrol";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Click to Start", canvas.width / 2, canvas.height / 2);
		ctx.restore();
	}
}
