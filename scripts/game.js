//@ts-check
import { AudioPlayer } from "./audio-player.js";
import { canvas, ctx } from "./canvas.js";
import { Barrier } from "./game-objects/barrier.js";
import { Door } from "./game-objects/door.js";
import { ExitPortal } from "./game-objects/exit-portal.js";
import { Key } from "./game-objects/key.js";
import { Monster } from "./game-objects/monster.js";
import { Player } from "./game-objects/player.js";
import { Level, levels } from "./levels.js";
import { GameOverScene } from "./scenes/game-over.js";
import { GameWonScene } from "./scenes/game-won.js";
import { StartScene } from "./scenes/start.js";

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

		/** @type { Level[] } */
		this.levels = levels;
		this.currentLevel = 0;
		this.levelNameHeader = document.getElementById("level-name");
		this.defaultLevelName = "Can you survive the madness?";

		this.currentTime = 0;

		this.audioPlayer = new AudioPlayer();

		document.addEventListener("keydown", (e) => {
			if (e.key === "n") {
				this.cycleLevel();
			}
		});
	}

	init() {
		let start = new StartScene(this);
		this.gameObjects.push(start);
		requestAnimationFrame(gameLoop);
	}

	resetGame() {
		// re-init game stuff
		this.player = undefined;
		this.barriers = [];
		this.monsters = [];
		this.keys = [];
		this.exitPortal = undefined;
		this.gameObjects = [];

		this.isPlayerDead = false;
		this.isLevelComplete = false;
	}

	start() {
		this.audioPlayer.init();
		this.audioPlayer.playMusic();
		this.currentLevel = 0;
		this.loadLevel();
	}

	restart() {
		this.resetGame();
		this.start();
	}

	gameOverLose() {
		this.resetGame();
		this.audioPlayer.loseGame();
		let gameOver = new GameOverScene(this);
		this.gameObjects = [gameOver];
		this.levelNameHeader.innerText = this.defaultLevelName;
	}

	gameOverWin() {
		this.resetGame();
		this.audioPlayer.winGame();
		let win = new GameWonScene(this);
		this.gameObjects = [win];
		this.levelNameHeader.innerText = this.defaultLevelName;
	}

	cycleLevel() {
		this.resetGame();
		this.currentLevel++;
		if (this.currentLevel === this.levels.length) {
			this.currentLevel = 0;
		}
		this.loadLevel();
	}

	nextLevel() {
		this.resetGame();
		this.currentLevel++;

		if (this.currentLevel < this.levels.length) {
			this.audioPlayer.exitPortal();
			this.loadLevel();
		} else {
			this.gameOverWin();
		}
	}

	loadLevel() {
		let level = this.levels[this.currentLevel];
		this.levelNameHeader.innerText = level.name;

		let monsterCoords = [];
		let playerCoords = { x: 0, y: 0 };

		level.data.forEach((row, idx) => {
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
		game.gameOverLose();
	}

	let elapsedTime = Math.floor(timestamp - game.currentTime);
	game.currentTime = timestamp;

	game.gameObjects.forEach((o) => {
		o.update(elapsedTime);
		o.render();
	});

	requestAnimationFrame(gameLoop);
}
