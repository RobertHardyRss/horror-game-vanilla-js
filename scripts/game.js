//@ts-check
import { Barrier } from "./game-objects/barrier.js";
import { Monster } from "./game-objects/monster.js";
import { Player } from "./game-objects/player.js";

export class Game {
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
