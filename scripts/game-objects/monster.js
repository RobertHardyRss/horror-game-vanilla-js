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
		super(16, 16, x, y);
		this.fillStyle = "red";
		this.baseSpeed = 3;

		this.isLastMoveColliding = false;

		this.game = game;

		this.isHunting = true;
		this.pathToPlayer = [];
		this.nextPathMove = [];
		this.movement = {
			timeSinceLastUpdate: 0,
			timeToNextUpdate: 1000, // 1000 milliseconds = 1 second
			defaultUpdateTime: 1000,
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

		if (this.isHunting) {
			this.huntingMove();
		} else {
			this.randomMove();
		}

		this.x += this.movement.x.speed * this.movement.x.direction;
		this.y += this.movement.y.speed * this.movement.y.direction;

		this.isLastMoveColliding = false;
		this.game.barriers.forEach((b) => {
			if (this.isHunting) return;

			let safeLocation = this.isColliding(b);
			if (safeLocation) {
				this.isLastMoveColliding = true;
				this.x = safeLocation.x;
				this.y = safeLocation.y;
			}
		});

		super.update(elapsedTime);
	}

	huntingMove() {
		this.movement.x.speed = this.baseSpeed;
		this.movement.y.speed = this.baseSpeed;

		if (
			this.movement.timeSinceLastUpdate >=
				this.movement.defaultUpdateTime ||
			!this.pathToPlayer.length
		) {
			this.pathToPlayer = this.game.findPath(this, this.game.player);
			this.nextPathMove = this.pathToPlayer.shift();
		}

		if (!this.nextPathMove) {
			this.randomMove();
			return;
		}

		let currentLocation = new Location(this.x, this.y);

		let currentMatrixCoords =
			this.game.getMatrixCoordinatesFromLocation(currentLocation);
		let xTarget = this.nextPathMove[0];
		let yTarget = this.nextPathMove[1];

		if (!this.nextPathMove) {
			this.randomMove();
			return;
		}

		if (
			currentMatrixCoords.x == xTarget &&
			currentMatrixCoords.y == yTarget
		) {
			this.nextPathMove = this.pathToPlayer.shift();

			if (!this.nextPathMove) {
				this.movement.x.direction = 0;
				this.movement.y.direction = 0;
				return;
			}

			xTarget = this.nextPathMove[0];
			yTarget = this.nextPathMove[1];
		}

		this.movement.x.direction = this.getDirection(
			currentMatrixCoords.x,
			xTarget
		);
		this.movement.y.direction = this.getDirection(
			currentMatrixCoords.y,
			yTarget
		);
	}

	getDirection(current, target) {
		if (current > target) return -1;
		if (current < target) return 1;
		return 0;
	}

	randomMove() {
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
	}
}
