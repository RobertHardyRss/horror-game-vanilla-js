//@ts-check
import { canvas, ctx } from "../canvas.js";

export class Button {
	/**
	 * @param {string} text
	 */
	constructor(text) {
		this.height = 32;
		this.width = this.height * 4;

		this.x = canvas.width / 2 - this.width / 2;
		this.y = canvas.height / 2 - this.height / 2;

		this.text = text;
		this.isVisible = false;
		this.background = "black";
		this.font = "20px fantasy";
		this.textColor = "white";
		this.wireUpClick();
	}

	wireUpClick() {
		window.addEventListener("click", this.onClick);
	}

	/** @param {MouseEvent} e */
	onClick(e) {
		if (this.isVisible && this.isClickTarget(e.offsetX, e.offsetY)) {
			this.click();
		}
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	isClickTarget(x, y) {
		return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
	}

	click() {
		console.log("Clicked!");
		this.hide();
	}
	show() {
		this.isVisible = true;
	}
	hide() {
		this.isVisible = false;
	}
	update() {}
	render() {
		ctx.save();
		ctx.fillStyle = this.background;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = this.textColor;
		ctx.fillText(this.text, this.x, this.y + 20, this.width);
		ctx.restore();
	}
}
