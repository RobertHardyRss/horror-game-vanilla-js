//@ts-check
import { GameObject } from "./game-object.js";

export class Monster extends GameObject {
	/**
	 * @param {GameObject[]} barriers
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(barriers, x, y) {
		super(32, 32);
		this.x = x;
		this.y = y;
		this.fillStyle = "red";
		this.baseSpeed = 1.5;
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

		this.isCollidingOnLastMove = false;
	}

	/** @param {number} elapsedTime */
	update(elapsedTime) {
		this.movement.timeSinceLastUpdate += elapsedTime;
		if (this.movement.timeSinceLastUpdate >= this.movement.timeToNextUpdate || this.isCollidingOnLastMove) {
			this.movement.x.direction = Math.random() >= 0.5 ? 1 : -1;
			this.movement.y.direction = Math.random() >= 0.5 ? 1 : -1;

			this.movement.x.speed = Math.random() * this.baseSpeed;
			this.movement.y.speed = Math.random() * this.baseSpeed;

			this.movement.timeToNextUpdate = Math.random() * 1000 + 1000;
			this.movement.timeSinceLastUpdate = 0;
		}

		this.x += this.movement.x.speed * this.movement.x.direction;
		this.y += this.movement.y.speed * this.movement.y.direction;

		this.isCollidingOnLastMove = false;
		this.barriers.forEach((b) => {
			let c = this.isColliding(b, false);
			if (c) {
				this.isCollidingOnLastMove = true;
				this.x = c.x;
				this.y = c.y;
			}
		});

		super.update(elapsedTime);
	}
}
