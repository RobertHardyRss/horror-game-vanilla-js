//@ts-check
import { canvas, ctx } from "./canvas.js";
import { level1 } from "./levels.js";
import { Game } from "./game.js";

let game = new Game();

let { player, monsters, barriers } = game.loadLevel(level1);
let gameObjects = [player, ...monsters, ...barriers];
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

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
