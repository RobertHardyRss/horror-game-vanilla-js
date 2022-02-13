import { GameObject } from "./game-object.js";

export class Player extends GameObject {
	/**
	 * @param {GameObject[]} barriers
	 * @param {number} x
	 * @param {number} y
	 */
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

		this.baseSpeed = 1.5;
		this.barriers = barriers;
		this.wireUpEvents();
	}

	wireUpEvents() {
		window.addEventListener("keydown", (e) => {
			this.toggleMovement(e.key, true);
		});

		window.addEventListener("keyup", (e) => {
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

	/** @param {number} elapsedTime	*/
	update(elapsedTime) {
		let speedMultiplier = 1;

		if (this.isRunning && !this.isSneaking) {
			speedMultiplier = 2;
		} else if (this.isSneaking && !this.isRunning) {
			speedMultiplier = 0.5;
		}

		let speed = this.baseSpeed * speedMultiplier;

		if (this.isMovingUp) this.y -= speed;
		if (this.isMovingDown) this.y += speed;

		if (this.isMovingRight) this.x += speed;
		if (this.isMovingLeft) this.x -= speed;

		this.barriers.forEach((b) => {
			let colliding = this.isColliding(b, true);
			if (colliding) {
				this.x = colliding.x;
				this.y = colliding.y;
			}
		});

		super.update(elapsedTime);
	}
}
