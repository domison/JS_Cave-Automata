export default class Cell {
	constructor(state = 666) {
		if (state < 0) {
			this.state = Math.floor(Math.random() * 2);
		} else {
			this.state = state;
		}
	}
	setState(state) {
		this.state = state;
	}

	toggleState() {
		this.state = -this.state + 1;
	}
}
