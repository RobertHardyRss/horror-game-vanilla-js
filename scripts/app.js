//@ts-check
import { GameObject } from "./game-objects/game-object.js";
import { canvas, ctx } from "./canvas.js";

// /** @type {HTMLCanvasElement} */
// //@ts-ignore
// const canvas = document.getElementById("game-canvas");
// const ctx = canvas.getContext("2d");
// canvas.width = 800;
// canvas.height = 600;

class Player extends GameObject {
	constructor() {
		super(32, 32);
		this.x = canvas.width / 2 - this.width / 2;
		this.y = canvas.height / 2 - this.height / 2;
		this.fillStyle = "green";

		this.isMovingUp = false;
		this.isMovingDown = false;
		this.isMovingRight = false;
		this.isMovingLeft = false;
		this.isSneaking = false;
		this.isRunning = false;

		this.baseSpeed = 3;

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

		//barr;
	}
}

class Monster extends GameObject {
	constructor() {
		super(32, 32);
		this.fillStyle = "red";
		this.baseSpeed = 3;

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
	/**
	 * @param {(Barrier | Player | Monster)[]} gameObjects
	 */
	constructor(gameObjects) {
		this.gameObjects = gameObjects;
	}

	checkForCollisions() {
		this.gameObjects.forEach((o) => {
			console.log(typeof o);
		});
	}
}

let b1 = new Barrier(600, 300, 32, 32 * 3);
let barriers = [b1];

let player = new Player();
let m1 = new Monster();

let gameObjects = [player, m1, ...barriers];

let game = new Game(gameObjects);

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
	// 	gameObjects.push(new Monster());
	// 	lastMonsterAdded = 0;
	// }

	game.checkForCollisions();

	gameObjects.forEach((o) => {
		o.update(elapsedTime);
		o.render();
	});

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
