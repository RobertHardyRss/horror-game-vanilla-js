
/** @type {HTMLAudioElement} */
let pickupKey = document.getElementById("pickup-key");

//@ts-check
export class AudioPlayer {
    constructor() {
        this.ctx = new AudioContext();
    }

    init() {
        if(this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    pickupKey() {
        pickupKey.play();
    }
}