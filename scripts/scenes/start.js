//@ts-check

import { canvas, ctx } from "../canvas.js";
import { Game } from "../game-objects/game.js";
import { GameObject } from "../game-objects/game-object.js";

export class StartScene extends GameObject {
	/**
	 * @param {Game} game
	 */
	constructor(game) {
		super(canvas.width, canvas.height, 0, 0);
		this.fillStyle = "black";
		this.textGradient = ctx.createLinearGradient(0, 250, 0, 350);
		this.textGradient.addColorStop(0, "red");
		this.textGradient.addColorStop(1, "Orange");
		this.game = game;
		canvas.addEventListener(
			"click",
			() => {
				this.game.start();
			},
			{ once: true }
		);
	}
	render() {
		super.render();
		ctx.save();
		ctx.fillStyle = this.textGradient;
		ctx.font = "100px zombiecontrol";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Click to Start!!", canvas.width / 2, canvas.height / 2);
		ctx.restore();
	}
}
