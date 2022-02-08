import { ctx } from "../canvas.js";

export class GameObject {
	constructor(w, h) {
		this.x = 0;
		this.y = 0;
		this.width = w;
		this.height = h;
		this.fillStyle = "";
	}

	update(elapsedTime) {}
	render() {
		ctx.save();
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}
