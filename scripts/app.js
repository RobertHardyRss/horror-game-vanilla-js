//@ts-check
import { canvas, ctx } from "./canvas.js";
import { level1 } from "./levels.js";
import { Game } from "./game.js";

let game = new Game();
game.start();

function gameLoop(timestamp) {
	// console.log(this);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let gameObjects = [
		game.player,
		...game.monsters,
		...game.barriers,
		...game.keys,
		game.exitPortal,
	];

	let elapsedTime = Math.floor(timestamp - game.currentTime);
	game.currentTime = timestamp;

	gameObjects.forEach((o) => {
		o.update(elapsedTime);
		o.render();
	});

	if (!game.isPlayerDead && !game.isLevelComplete)
		requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
