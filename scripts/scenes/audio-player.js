/** @type {HTMLAudioElement} */
let pickupKey = document.getElementById("pickup-key");
let doorOpen = document.getElementById("door-open");
let winGame = document.getElementById("win-noise");
let loseDead = document.getElementById("lose-dead");
let exit = document.getElementById("exit-portal");
let musicLow = document.getElementById("music-low");
let musicMed = document.getElementById("music-med");
let musicHigh1 = document.getElementById("music-high1");
let musicHigh2 = document.getElementById("music-high2");
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
		let loopToPlay = this.currentLoop;
	}
	/**
	 * @param {HTMLAudioElement} loop */
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
			},
			{ once: true }
		);
	}
	pickupKey() {
		pickupKey.play();
	}
	doorOpen() {
		doorOpen.volume = 0.2;
		doorOpen.play();
	}
	winGame() {
		winGame.play();
	}
	loseDead() {
		loseDead.volume = 0.1;
		loseDead.play();
	}
	exit() {
		exit.play();
	}
}
