//@ts-check
import { GameObject, Location } from "./game-object.js";
import { canvas, ctx } from "../canvas.js";
import { Game } from "./game.js";
export class Player extends GameObject {
	/**
	 * @param {Game} game
	 * @param {any} x
	 * @param {any} y
	 */
	constructor(game, x, y) {
		super(32, 32, x, y);
		this.fillstyle = "green";
		this.isMovingUp = false;
		this.isMovingDown = false;
		this.isMovingRight = false;
		this.isMovingLeft = false;
		this.isSneaking = false;
		this.isRunning = false;
		this.baseSpeed = 3;
		this.game = game;
		this.inventory = [];
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
			case "ArrowLeft":
			case "a":
				this.isMovingLeft = toggleValue;
				break;
			case "ArrowRight":
			case "d":
				this.isMovingRight = toggleValue;
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
		this.game.barriers.forEach((b) => {
			this.game.barriers.forEach((b) => {
				if (b.isOpen) return;
				let safeLocation = this.isColliding(b);
				if (safeLocation && b.isLocked && this.inventory.length) {
					this.game.audioPlayer.doorOpen();
					this.inventory.pop();
					b.isLocked = false;
					b.isOpen = true;
					return;
				}

				if (safeLocation) {
					this.x = safeLocation.x;
					this.y = safeLocation.y;
				}
			});
		});

		this.game.keys
			.filter((k) => !k.isPickedUp)
			.forEach((k) => {
				if (this.isColliding(k)) {
					this.game.audioPlayer.pickupKey();
					this.inventory.push(k);
					k.isPickedUp = true;
				}
			});

		super.update(elapsedTime);
	}
}
