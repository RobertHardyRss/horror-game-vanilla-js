/** @type {HTMLAudioElement} */
let pickupKey = document.getElementById("pickup-key");
let gameWin = document.getElementById("game-win");
let openDoor = document.getElementById("open-door");
let gameLose = document.getElementById("game-lose");
let exitPortal = document.getElementById("exit-portal");

let musicVolume = 0.05;
let musicLow = document.getElementById("music-low");
musicLow.volume = musicVolume;
let musicMed = document.getElementById("music-med");
musicMed.volume = musicVolume;
let musicHigh1 = document.getElementById("music-hi1");
musicHigh1.volume = musicVolume;
let musicHigh2 = document.getElementById("music-hi2");
musicHigh2.volume = musicVolume;

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

	stopMusic() {
		this.loops.forEach((l) => {
			l.pause();
			l.currentTime = 0;
		});
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
		this.stopMusic();
		gameLose.volume = 0.2;
		gameLose.play();
	}

	winGame() {
		this.stopMusic();
		gameWin.play();
	}

	exitPortal() {
		this.stopMusic();
		exitPortal.play();
		this.playMusic();
	}
}
