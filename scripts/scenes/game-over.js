//@ts-check

import { canvas, ctx } from "../canvas.js";
import { Game } from "../game-objects/game.js";
import { GameObject } from "../game-objects/game-object.js";

export class GameOverScene extends GameObject {
	/**
	 * @param {Game} game
	 */
	constructor(game) {
		super(canvas.width, canvas.height, 0, 0);

		this.fillStyle = ctx.createLinearGradient(0, 0, 0, canvas.height);
		this.fillStyle.addColorStop(0, "gray");
		this.fillStyle.addColorStop(1, "black");
		this.textGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		this.textGradient.addColorStop(0, "red");
		this.textGradient.addColorStop(1, "Orange");
		this.game = game;
		canvas.addEventListener(
			"click",
			() => {
				this.game.reset();
			},
			{ once: true }
		);
	}
	render() {
		super.render();
		ctx.save();
		ctx.fillStyle = this.textGradient;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "100px zombiecontrol";
		ctx.fillText("YOU DIED", canvas.width / 2, 100);
		ctx.font = "70px zombiecontrol";
		ctx.fillText(
			`You survived ${this.game.currentLevel} levels`,
			canvas.width / 2,
			canvas.height / 2
		);
		ctx.font = "75px zombiecontrol";
		ctx.fillText(
			"Click to try again!",
			canvas.width / 2,
			canvas.height - 60
		);

		ctx.restore();
	}
}
