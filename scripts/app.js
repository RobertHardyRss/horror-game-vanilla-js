//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

class Player {
	constructor() {
		this.width = 32;
		this.height = 32;
		this.x = canvas.width / 2 - this.width / 2;
		this.y = canvas.height / 2 - this.height / 2;

		this.wireUpEvents();
	}

	wireUpEvents() {
		window.addEventListener("keydown", (e) => {
			console.log(e.key);
		});
	}

	update() {}

	render() {
		ctx.save();
		ctx.fillStyle = "green";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}

let player = new Player();

function gameLoop() {
	// clear off the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	player.update();
	player.render();

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
