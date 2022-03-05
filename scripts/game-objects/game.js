//@ts-check

import { Key } from "./key.js";
import { GameObject } from "./game-object.js";
import { canvas, ctx } from "../canvas.js";
import { Barrier } from "./barrier.js";
import { Monster } from "./monster.js";
import { Player } from "./player.js";
import { Door } from "./door.js";
import { ExitPortal } from "../exit-portal.js";
import { StartScene } from "../scenes/start.js";
import { GameOverScene } from "../scenes/game-over.js";
import { GameWonScene } from "../scenes/game-won.js";
import { AudioPlayer } from "../scenes/audio-player.js";
import { level1 } from "../levels.js";

export class Game {
	constructor() {
		this.player = undefined;
		this.barriers = [];
		this.monsters = [];
		this.keys = [];
		this.exitPortal = undefined;
		this.gameObjects = [];

		this.isDead = false;
		this.isLevelComplete = false;

		this.levels = [level1];
		this.currentLevel = 0;

		this.currentTime = 0;

		this.audioPlayer = new AudioPlayer();
	}
	init() {
		let start = new StartScene(this);
		this.gameObjects.push(start);
		requestAnimationFrame(gameLoop);
	}
	reset() {
		this.resetGame();
		this.start();
	}
	resetGame() {
		this.player = undefined;
		this.barriers = [];
		this.monsters = [];
		this.keys = [];
		this.exitPortal = undefined;
		this.gameObjects = [];

		this.isDead = false;
		this.isLevelComplete = false;
	}
	start() {
		this.audioPlayer.init();
		this.audioPlayer.playMusic();
		this.currentLevel = 0;
		this.loadLevel();
	}
	gameOver() {
		this.reset();
		this.audioPlayer.loseDead();
		let gameOver = new GameOverScene(this);
		this.gameObjects.push(gameOver);
	}

	winGame() {
		this.reset();
		this.audioPlayer.winGame();
		let winGame = new GameWonScene(this);
		this.gameObjects = [winGame];
	}
	nextLevel() {
		this.resetGame();
		this.currentLevel++;
		if (this.currentLevel < this.levels.length) {
			this.audioPlayer.exit();
			this.loadLevel();
		} else {
			this.winGame();
		}
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

	if (game.isDead) {
		game.gameOver();
	}

	let elapsedTime = Math.floor(timestamp - game.currentTime);
	game.currentTime = timestamp;

	game.gameObjects.forEach((o) => {
		o.update(elapsedTime);
		o.render();
	});

	requestAnimationFrame(gameLoop);
}
