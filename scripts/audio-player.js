/** @type {HTMLAudioElement} */
let pickupKey = document.getElementById("pickup-key");
let gameWin = document.getElementById("game-win");
let openDoor = document.getElementById("open-door");
let gameLose = document.getElementById("game-lose");
let exitPortal = document.getElementById("exit-portal");

let musicLow = document.getElementById("music-low");
let musicMed = document.getElementById("music-med");
let musicHigh1 = document.getElementById("music-hi1");
let musicHigh2 = document.getElementById("music-hi2");

//@ts-check
export class AudioPlayer {
	constructor() {
		this.ctx = new AudioContext();

		this.currentLoop = 0;
		this.loops = [musicLow, musicMed, musicHigh1, musicHigh2];
	}

	init() {
		if (this.ctx.state === "suspended") {
			this.ctx.resume();
		}
	}

	playMusic() {
		this.currentLoop = 0;
		let loopToPlay = this.loops[this.currentLoop];
		loopToPlay.play();
		this.wireUpNextMusicLoop(loopToPlay);
	}

	/** @param {HTMLAudioElement} loop */
	wireUpNextMusicLoop(loop) {
		loop.addEventListener(
			"ended",
			() => {
				this.currentLoop++;
				if (this.currentLoop === this.loops.length) {
					this.currentLoop -= 2;
				}
				let loopToPlay = this.loops[this.currentLoop];
				loopToPlay.play();
				this.wireUpNextMusicLoop(loopToPlay);
			},
			{ once: true }
		);
	}

	pickupKey() {
		pickupKey.play();
	}

	openDoor() {
		openDoor.volume = 0.1;
		openDoor.play();
	}

	loseGame() {
		openDoor.volume = 0.1;
		gameLose.play();
	}

	winGame() {
		gameWin.play();
	}

	exitPortal() {
		exitPortal.play();
	}
}
