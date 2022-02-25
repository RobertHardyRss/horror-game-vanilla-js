//@ts-check
import { canvas, ctx } from "./canvas.js";
import { Barrier } from "./game-objects/barrier.js";
import { Door } from "./game-objects/door.js";
import { ExitPortal } from "./game-objects/exit-portal.js";
import { Key } from "./game-objects/key.js";
import { Monster } from "./game-objects/monster.js";
import { Player } from "./game-objects/player.js";
import { level1, level2 } from "./levels.js";

export class Game {
	constructor() {
		this.player = undefined;
		this.barriers = [];
		this.monsters = [];
		this.keys = [];
		this.exitPortal = undefined;
		this.gameObjects = [];

		this.isPlayerDead = false;
		this.isLevelComplete = false;

		this.levels = [level1, level2];
		this.currentLevel = 0;

		this.currentTime = 0;
	}

	start() {
		this.loadLevel();
		requestAnimationFrame(gameLoop);
	}

	nextLevel() {
		// re-init game stuff
		this.player = undefined;
		this.barriers = [];
		this.monsters = [];
		this.keys = [];
		this.exitPortal = undefined;
		this.gameObjects = [];

		this.isLevelComplete = false;
		this.currentLevel++;
		this.loadLevel();
	}

	loadLevel() {
		let level = this.levels[this.currentLevel];

		let monsterCoords = [];
		let playerCoords = { x: 0, y: 0 };

		level.forEach((row, idx) => {
			for (let col = 0; col < row.length; col++) {
				let x = col * 16;
				let y = idx * 16;

				switch (row[col]) {
					case "w":
						this.barriers.push(new Barrier(x, y, 16, 16));
						break;
					case "m":
						// set x and y properties for monster
						monsterCoords.push({ x: x, y: y });
						break;
					case "p":
						// set x and y coordinates for player
						playerCoords = { x: x, y: y };
						break;
					case "k":
						this.keys.push(new Key(x, y));
						break;
					case "d":
						this.barriers.push(new Door(x, y, true));
						break;
					case "D":
						this.barriers.push(new Door(x, y, false));
						break;
					case "x":
						this.exitPortal = new ExitPortal(x, y, this);
						break;
				}
			}
		});

		monsterCoords.forEach((c) => {
			this.monsters.push(new Monster(this, c.x, c.y));
		});

		this.player = new Player(this, playerCoords.x, playerCoords.y);

		this.gameObjects = [
			game.player,
			...game.monsters,
			...game.barriers,
			...game.keys,
			game.exitPortal,
		];
	}
}

export let game = new Game();

function gameLoop(timestamp) {
	// console.log(this);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (game.isLevelComplete) {
		game.nextLevel();
	}
	if (game.isPlayerDead) {
		return;
	}

	let elapsedTime = Math.floor(timestamp - game.currentTime);
	game.currentTime = timestamp;

	game.gameObjects.forEach((o) => {
		o.update(elapsedTime);
		o.render();
	});

	requestAnimationFrame(gameLoop);
}
