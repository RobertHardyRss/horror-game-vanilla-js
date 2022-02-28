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
		this.game = game;

		this.fillGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		this.fillGradient.addColorStop(0, "green");
		this.fillGradient.addColorStop(1, "black");
		this.fillStyle = this.fillGradient;

		this.textGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		this.textGradient.addColorStop(0, "yellow");
		this.textGradient.addColorStop(1, "navy");

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
		let cx = canvas.width / 2;
		let cy = canvas.height / 2;

		ctx.save();

		ctx.strokeStyle = "yellow";
		ctx.fillStyle = this.textGradient;

		ctx.font = "200px zombiecontrol";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		ctx.fillText("You Won!", cx, cy - 150);
		ctx.strokeText("You Won!", cx, cy - 150);

		ctx.font = "60px zombiecontrol";
		ctx.fillText(`levels completed: ${this.game.currentLevel}`, cx, cy);
		ctx.strokeText(`levels completed: ${this.game.currentLevel}`, cx, cy);

		ctx.font = "80px zombiecontrol";
		ctx.fillText("Click to try again!", cx, cy + 250);
		ctx.strokeText("Click to try again!", cx, cy + 250);

		ctx.restore();
	}
}
