//@ts-check
import { Barrier } from "./game-objects/barrier.js";
import { Monster } from "./game-objects/monster.js";
import { Player } from "./game-objects/player.js";

import { canvas, ctx } from "./canvas.js";
import { level1, level2, levelTest } from "./levels.js";

class Game {
	constructor() {}

	/**
	 * @param {string[]} level
	 */
	loadLevel(level) {
		let barriers = [];
		let monster = [];
		let monsterCoords = [];
		let player;
		let playerCoords = { x: 0, y: 0 };

		level.forEach((row, idx) => {
			for (let col = 0; col < row.length; col++) {
				let x = col * 16;
				let y = idx * 16;

				switch (row[col]) {
					case "w":
						barriers.push(new Barrier(x, y));
						break;
					case "m":
						// set x and y properties for monster
						monsterCoords.push({ x: x, y: y });
						break;
					case "p":
						// set x and y coordinates for player
						playerCoords = { x: x, y: y };
						break;
				}
			}
		});

		monsterCoords.forEach((c) => {
			monster.push(new Monster(barriers, c.x, c.y));
		});

		player = new Player(barriers, playerCoords.x, playerCoords.y);

		return { player: player, monsters: monster, barriers: barriers };
	}
}

let game = new Game();

let { player, monsters, barriers } = game.loadLevel(level2);
let gameObjects = [player, ...monsters, ...barriers];

let currentTime = 0;
let lastMonsterAdded = 0;
const monsterSpawnRate = 1000;

function gameLoop(timestamp) {
	// clear off the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let elapsedTime = Math.floor(timestamp - currentTime);
	currentTime = timestamp;

	// lastMonsterAdded += elapsedTime;
	// if (lastMonsterAdded >= monsterSpawnRate) {
	// 	gameObjects.push(new Monster(barriers));
	// 	lastMonsterAdded = 0;
	// }

	gameObjects.forEach((o) => {
		o.update(elapsedTime);
		o.render();
	});

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
