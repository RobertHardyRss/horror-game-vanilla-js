//@ts-check
import { canvas, ctx } from "./canvas.js";
import { level1 } from "./levels.js";
import { Game } from "./game.js";

let game = new Game();

game.loadLevel(level1);
let gameObjects = [
	game.player,
	...game.monsters,
	...game.barriers,
	...game.keys,
	game.exitPortal,
];

let currentTime = 0;

function gameLoop(timestamp) {
	// clear off the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let elapsedTime = Math.floor(timestamp - currentTime);
	currentTime = timestamp;

	gameObjects.forEach((o) => {
		o.update(elapsedTime);
		o.render();
	});

	if (!game.isPlayerDead && !game.isLevelComplete)
		requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
