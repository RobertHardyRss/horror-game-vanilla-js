//@ts-check
import { GameObject, Location } from "./game-object.js";
import { canvas, ctx } from "../canvas.js";

export class Player extends GameObject {
	constructor(barriers, x, y) {
		super(32, 32, x, y);
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
			let safeLocation = this.isColliding(b);
			if (safeLocation) {
				this.x = safeLocation.x;
				this.y = safeLocation.y;
			}
		});

		super.update(elapsedTime);
	}
}
