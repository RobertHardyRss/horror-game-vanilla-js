//@ts-check
import { Barrier } from "./game-objects/barrier.js";
import { GameObject, Location } from "./game-objects/game-object.js";
import { Key } from "./game-objects/key.js";
import { Monster } from "./game-objects/monster.js";
import { Player } from "./game-objects/player.js";
import { AStarFinder, Grid } from "./pathfinding/pathfinding.js";

export class Game {
	constructor() {
		this.pathfindingGrid = undefined;
		this.gridSize = 16;
		this.player = undefined;
		this.barriers = [];
		this.monsters = [];
		this.keys = [];
		this.currentLevel = [];
	}

	/**
	 * @param {string[]} level
	 */
	loadLevel(level) {
		this.currentLevel = level;
		// let monster = [];
		let monsterCoords = [];
		// let player;
		let playerCoords = { x: 0, y: 0 };
		// let keys = [];
		let pathMatrix = [];

		level.forEach((row, idx) => {
			let matrixRow = [];
			for (let col = 0; col < row.length; col++) {
				let x = col * this.gridSize;
				let y = idx * this.gridSize;

				switch (row[col]) {
					case "w":
						this.barriers.push(new Barrier(x, y, 16, 16));
						break;
					case "m":
						// set x and y properties for monster
						monsterCoords.push({ x: x, y: y });
						break;
					case "p":
						// set x and y coordinates for player
						playerCoords = { x: x, y: y };
						break;
					case "k":
						this.keys.push(new Key(x, y));
						break;
				}

				matrixRow.push(row[col] === "w" ? 1 : 0);
			}
			pathMatrix.push(matrixRow);
		});

		//@ts-ignore
		this.pathfindingGrid = new Grid(pathMatrix);

		monsterCoords.forEach((c) => {
			this.monsters.push(new Monster(this, c.x, c.y));
		});

		this.player = new Player(this, playerCoords.x, playerCoords.y);

		return {
			player: this.player,
			monsters: this.monsters,
			barriers: this.barriers,
			keys: this.keys,
		};
	}

	/**
	 * @param {GameObject} a
	 * @param {GameObject} b
	 */
	findPath(a, b) {
		let gridClone = this.pathfindingGrid.clone();
		let aCenter = new Location(a.x, a.y);
		let bCenter = new Location(b.x, b.y);
		let aCoords = this.getMatrixCoordinatesFromLocation(aCenter);
		let bCoords = this.getMatrixCoordinatesFromLocation(bCenter);

		//@ts-ignore
		let finder = new AStarFinder({
			allowDiagonal: false,
			dontCrossCorners: true,
		});

		let path = finder.findPath(
			aCoords.x,
			aCoords.y,
			bCoords.x,
			bCoords.y,
			gridClone
		);
		return path;
	}

	/**
	 * @param {Location} location
	 */
	getMatrixCoordinatesFromLocation(location) {
		let x = Math.floor(location.x / 16);
		let y = Math.floor(location.y / 16);
		return { x: x, y: y };
	}
}
