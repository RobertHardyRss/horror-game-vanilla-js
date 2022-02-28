const AudioContext = window.AudioContext || window.webkitAudioContext;

/** @type {HTMLAudioElement} */
const lowTensionLoop = document.getElementById("undead-rising-low-tension");
/** @type {HTMLAudioElement} */
const medTensionLoop = document.getElementById("undead-rising-med-tension");
/** @type {HTMLAudioElement} */
const high1TensionLoop = document.getElementById("undead-rising-hi1-tension");
/** @type {HTMLAudioElement} */
const high2TensionLoop = document.getElementById("undead-rising-hi2-tension");

/** @type {HTMLAudioElement} */
const keyPickup = document.getElementById("key-pickup");
/** @type {HTMLAudioElement} */
const door = document.getElementById("door");
/** @type {HTMLAudioElement} */
const playerDeath = document.getElementById("player-death");
/** @type {HTMLAudioElement} */
const playerWin = document.getElementById("player-win");
/** @type {HTMLAudioElement} */
const exitPortal = document.getElementById("exit-portal");

//@ts-check
export class AudioPlayer {
	constructor() {
		/** @type {AudioContext} */
		this.ctx = new AudioContext();
		this.musicGainNode = this.ctx.createGain();
		this.musicGainNode.gain.value = 0.1;

		this.lowTensionLoopSource =
			this.ctx.createMediaElementSource(lowTensionLoop);
		this.medTensionLoopSource =
			this.ctx.createMediaElementSource(medTensionLoop);
		this.high1TensionLoopSource =
			this.ctx.createMediaElementSource(high1TensionLoop);
		this.high2TensionLoopSource =
			this.ctx.createMediaElementSource(high2TensionLoop);

		this.lowTensionLoopSource.connect(this.musicGainNode);
		this.medTensionLoopSource.connect(this.musicGainNode);
		this.high1TensionLoopSource.connect(this.musicGainNode);
		this.high2TensionLoopSource.connect(this.musicGainNode);

		this.musicGainNode.connect(this.ctx.destination);

		this.currentMusicLoop = 0;
		this.musicLoopsBuildup = [
			lowTensionLoop,
			medTensionLoop,
			high1TensionLoop,
			high2TensionLoop,
		];
	}

	init() {
		if (this.ctx.state === "suspended") {
			this.ctx.resume();
		}
	}

	setupLoopSources() {}

	playMusic() {
		this.currentMusicLoop = 0;
		this.musicLoopsBuildup[this.currentMusicLoop].play();
		this.wireUpNextMusicLoop(this.musicLoopsBuildup[this.currentMusicLoop]);
	}

	/** @param {HTMLAudioElement} audioElement */
	wireUpNextMusicLoop(audioElement) {
		audioElement.addEventListener(
			"ended",
			() => {
				this.currentMusicLoop++;
				if (this.currentMusicLoop == this.musicLoopsBuildup.length)
					this.currentMusicLoop -= 2;
				console.log("Playing loop ", this.currentMusicLoop);
				this.musicLoopsBuildup[this.currentMusicLoop].play();
				this.wireUpNextMusicLoop(
					this.musicLoopsBuildup[this.currentMusicLoop]
				);
			},
			{ once: true }
		);
	}

	pickupKey() {
		keyPickup.play();
	}

	openDoor() {
		door.play();
	}

	exitPortal() {
		exitPortal.play();
	}

	playerDeath() {
		this.playMusic();
		playerDeath.play();
	}

	playerWin() {
		this.playMusic();
		playerWin.play();
	}
}
