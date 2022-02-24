//@ts-check
import { Game } from "../game.js";
import { GameObject, Location } from "./game-object.js";

export class Monster extends GameObject {
	/**
	 * @param {Game} game
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(game, x, y) {
		super(32, 32, x, y);
		this.fillStyle = "red";
		this.baseSpeed = 3;

		this.isLastMoveColliding = false;

		this.game = game;

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
			this.movement.timeSinceLastUpdate >=
				this.movement.timeToNextUpdate ||
			this.isLastMoveColliding
		) {
			this.movement.x.direction = Math.random() >= 0.5 ? 1 : -1;
			this.movement.y.direction = Math.random() >= 0.5 ? 1 : -1;

			this.movement.x.speed = Math.random() * this.baseSpeed;
			this.movement.y.speed = Math.random() * this.baseSpeed;

			this.movement.timeToNextUpdate = Math.random() * 1000 + 500;
			this.movement.timeSinceLastUpdate = 0;
		}

		this.x += this.movement.x.speed * this.movement.x.direction;
		this.y += this.movement.y.speed * this.movement.y.direction;

		this.isLastMoveColliding = false;
		this.game.barriers.forEach((b) => {
			if (b.isOpen) return;

			let safeLocation = this.isColliding(b);
			if (safeLocation) {
				this.isLastMoveColliding = true;
				this.x = safeLocation.x;
				this.y = safeLocation.y;
			}
		});

		if (this.isColliding(this.game.player)) {
			// yummy player meat
			this.game.isPlayerDead = true;
		}

		super.update(elapsedTime);
	}
}
