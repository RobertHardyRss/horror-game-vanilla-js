//@ts-check
import { GameObject } from "./game-objects/game-object.js";
import { canvas, ctx } from "./canvas.js";
import { level1 } from "./levels.js";

class Player extends GameObject {
	constructor(barriers, x, y) {
		super(32, 32);
		this.x = x;
		this.y = y;
		this.fillStyle = "green";

		this.isMovingUp = false;
		this.isMovingDown = false;
		this.isMovingRight = false;
		this.isMovingLeft = false;
		this.isSneaking = false;
		this.isRunning = false;

		this.baseSpeed = 3;
		this.barriers = barriers;

		this.wireUpEvents();
	}

	wireUpEvents() {
		window.addEventListener("keydown", (e) => {
			// console.log(e.key);
			this.toggleMovement(e.key, true);
		});

		window.addEventListener("keyup", (e) => {
			// console.log(e.key);
			this.toggleMovement(e.key, false);
		});
	}

	toggleMovement(key, toggleValue) {
		switch (key) {
			case "ArrowUp":
			case "w":
				this.isMovingUp = toggleValue;
				break;
			case "ArrowDown":
			case "s":
				this.isMovingDown = toggleValue;
				break;
			case "ArrowRight":
			case "d":
				this.isMovingRight = toggleValue;
				break;
			case "ArrowLeft":
			case "a":
				this.isMovingLeft = toggleValue;
				break;
			case "Control":
				this.isSneaking = toggleValue;
				break;
			case "Shift":
				this.isRunning = toggleValue;
				break;
		}
	}

	update(elapsedTime) {
		let speedMultiplier = 1;

		if (this.isRunning && !this.isSneaking) {
			speedMultiplier = 2;
		} else if (this.isSneaking && !this.isRunning) {
			speedMultiplier = 0.5;
		}

		let speed = this.baseSpeed * speedMultiplier;

		if (this.isMovingUp) {
			this.y -= speed;
		}

		if (this.isMovingDown) {
			this.y += speed;
		}

		if (this.isMovingRight) {
			this.x += speed;
		}

		if (this.isMovingLeft) {
			this.x -= speed;
		}

		if (this.x + this.width >= canvas.width) {
			this.x = canvas.width - this.width;
		}
		if (this.x <= 0) {
			this.x = 0;
		}
		if (this.y + this.height >= canvas.height) {
			this.y = canvas.height - this.height;
		}
		if (this.y <= 0) {
			this.y = 0;
		}

		this.barriers.forEach((b) => {
			if (this.isColliding(b)) {
				let bounds = b.getBounds();

				// there's a bug when pressing multiple keys.  Fix this later.
				if (this.isMovingDown) {
					this.y = bounds.top - this.height;
				} else if (this.isMovingUp) {
					this.y = bounds.bottom;
				}

				if (this.isMovingRight) {
					this.x = bounds.left - this.width;
				} else if (this.isMovingLeft) {
					this.x = bounds.right;
				}
			}
		});
	}
}

class Monster extends GameObject {
	constructor(barriers, x, y) {
		super(32, 32);
		this.fillStyle = "red";
		this.baseSpeed = 3;

		this.x = x;
		this.y = y;

		this.barriers = barriers;

		this.movement = {
			timeSinceLastUpdate: 0,
			timeToNextUpdate: 1000, // 1000 milliseconds = 1 second
			x: {
				direction: 1,
				speed: this.baseSpeed,
			},
			y: {
				direction: 1,
				speed: this.baseSpeed,
			},
		};
	}

	update(elapsedTime) {
		this.movement.timeSinceLastUpdate += elapsedTime;
		if (
			this.movement.timeSinceLastUpdate >= this.movement.timeToNextUpdate
		) {
			this.movement.x.direction = Math.random() >= 0.5 ? 1 : -1;
			this.movement.y.direction = Math.random() >= 0.5 ? 1 : -1;

			this.movement.x.speed = Math.random() * this.baseSpeed;
			this.movement.y.speed = Math.random() * this.baseSpeed;

			this.movement.timeToNextUpdate = Math.random() * 1000 + 500;
			this.movement.timeSinceLastUpdate = 0;
		}

		if (this.x + this.width >= canvas.width) {
			this.movement.x.direction = -1;
		}
		if (this.x <= 0) {
			this.movement.x.direction = 1;
		}
		if (this.y + this.height >= canvas.height) {
			this.movement.y.direction = -1;
		}
		if (this.y <= 0) {
			this.movement.y.direction = 1;
		}

		this.barriers.forEach((b) => {
			if (this.isColliding(b)) {
				this.movement.x.direction *= -1;
				this.movement.y.direction *= -1;
			}
		});

		this.x += this.movement.x.speed * this.movement.x.direction;
		this.y += this.movement.y.speed * this.movement.y.direction;
	}
}

class Barrier extends GameObject {
	constructor(x, y, w, h) {
		super(w, h);
		this.x = x;
		this.y = y;
		this.fillStyle = "black";
	}
}

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
						barriers.push(new Barrier(x, y, 16, 16));
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

let { player, monsters, barriers } = game.loadLevel(level1);

// let b1 = new Barrier(600, 300, 32, 32 * 3);
// let barriers = [b1];

// let player = new Player(barriers);
// let m1 = new Monster(barriers);

let gameObjects = [player, ...monsters, ...barriers];

let currentTime = 0;
let lastMonsterAdded = 0;
const monsterSpawnRate = 1000;

function gameLoop(timestamp) {
	//console.log(timestamp);
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
