//@ts-check
import { GameObject, Location } from "./game-object.js";

export class Monster extends GameObject {
	constructor(barriers, x, y) {
		super(32, 32, x, y);
		this.fillStyle = "red";
		this.baseSpeed = 3;

		this.isLastMoveColliding = false;

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
		this.barriers.forEach((b) => {
			let safeLocation = this.isColliding(b);
			if (safeLocation) {
				this.isLastMoveColliding = true;
				this.x = safeLocation.x;
				this.y = safeLocation.y;
			}
		});

		super.update(elapsedTime);
	}
}
