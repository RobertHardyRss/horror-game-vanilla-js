//@ts-check

import { canvas, ctx } from "../canvas.js";
import { Game } from "../game.js";
import { GameObject } from "../game-objects/game-object.js";

export class GameWonScene extends GameObject {
	/**
	 * @param {Game} game
	 */
	constructor(game) {
		super(canvas.width, canvas.height, 0, 0);
		this.fillStyle = ctx.createLinearGradient(0, 0, 0, canvas.height);
		this.fillStyle.addColorStop(0, "green");
		this.fillStyle.addColorStop(1, "black");

		this.textGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		this.textGradient.addColorStop(0, "gold");
		this.textGradient.addColorStop(0.4, "purple");
		this.textGradient.addColorStop(0.5, "gold");
		this.textGradient.addColorStop(0.8, "green");
		this.textGradient.addColorStop(1, "purple");

		this.game = game;

		canvas.addEventListener(
			"click",
			() => {
				this.game.restart();
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

		ctx.font = "180px zombiecontrol";
		ctx.fillText("You Won!", canvas.width / 2, 150);

		ctx.font = "60px zombiecontrol";
		ctx.fillText(
			`You completed ${this.game.currentLevel} levels`,
			canvas.width / 2,
			canvas.height / 2
		);

		ctx.font = "80px zombiecontrol";
		ctx.fillText(
			"Click to play again!",
			canvas.width / 2,
			canvas.height - 60
		);

		ctx.restore();
	}
}
