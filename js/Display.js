import { game, loop } from './gol-oop.js';
export default class Display {
	constructor() {
		// canvas setup
		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');
		this.width = this.canvas.width = window.innerWidth * (9 / 10);
		this.height = this.canvas.height = window.innerHeight * (9 / 10);
		this.height <= this.width
			? (this.width = this.height)
			: (this.height = this.width);
		this.resolution = Math.floor(this.width / 64);
		this.cols = Math.floor(this.width / this.resolution);
		this.rows = Math.floor(this.height / this.resolution);

		// other DOM elements
		// div
		this.container = document.getElementById('container');
		// btn
		this.btnNames = [
			'Play',
			'Undo',
			'Conway',
			'Caive',
			'Aisle',
			'Terrain',
			'Clear',
			'Random',
			'Instant Cave',
			'Instant Isles',
			'Instant Worms',
		];
		this.buttons = this.addButtons(this.btnNames);
		this.buttons = document.querySelectorAll('button');
		this.buttons.forEach((btn) => {
			return btn.addEventListener('click', (event) => {
				switch (event.target) {
					case this.buttons[0]: // play
						game.board.algorithm.setRule([[2, 3], [3]]);
						game.notGOL = false;
						if (btn.textContent != 'Play') {
							btn.textContent = 'Play';
							game.isLooped = false;
						} else {
							btn.textContent = 'Stop';
							game.isLooped = true;
						}
						loop();
						break;
					case this.buttons[1]: // undo
						game.regressBoard();
						this.render(game.board.grid);
						btn.toggleAttribute('disabled');
						break;
					case this.buttons[2]: // conway
						game.notGOL = false;

						game.board.algorithm.setRule([[2, 3], [3]]);
						game.progressBoard(1);
						this.render(game.board.grid);
						break;
					case this.buttons[3]: // caveAI
						game.notGOL = true;

						// apply B678/S345678
						game.board.algorithm.setRule([
							// [2, 3, 4, 5, 6, 7, 8],
							// [5, 6, 7, 8],
							[3, 4, 5, 6, 7, 8],
							[6, 7, 8],
						]);
						game.progressBoard(1);
						this.render(game.board.grid);
						break;
					case this.buttons[4]: // AIsland
						game.board.algorithm.setRule([
							[5, 6, 7, 8],
							[5, 6, 7, 8],
						]);
						game.progressBoard(1);
						this.render(game.board.grid);
						break;
					case this.buttons[5]: // Terrain
						game.terrainOn = !game.terrainOn;
						game.board.toggleTerrain();
						game.board.terrain = true;
						this.render(game.board.grid);
						break;
					case this.buttons[6]: // clear
						game.board.resetGrid();
						this.render(game.board.grid);
						break;
					case this.buttons[7]: // randomize
						game.board.randomizeGrid();
						this.render(game.board.grid);
						break;
					case this.buttons[8]: // instant cave
						game.board.randomizeGrid();
						game.board.algorithm.setRule([
							[3, 4, 5, 6, 7, 8],
							[6, 7, 8],
						]);
						game.progressBoard(1);
						game.board.algorithm.setRule([
							[5, 6, 7, 8],
							[5, 6, 7, 8],
						]);
						game.progressBoard(1);
						game.board.algorithm.setRule([
							[3, 4, 5, 6, 7, 8],
							[6, 7, 8],
						]);
						game.progressBoard(10);
						game.board.toggleTerrain();
						this.render(game.board.grid);
						break;
					case this.buttons[9]: // instant isles
						game.notGOL = false;

						game.board.randomizeGrid();
						game.board.algorithm.setRule([
							[2, 3, 4, 5, 6, 7, 8],
							[6, 7, 8],
						]);
						game.progressBoard(1);

						game.board.algorithm.setRule([
							[5, 6, 7, 8],
							[5, 6, 7, 8],
						]);
						game.progressBoard(8);
						game.board.algorithm.setRule([
							[3, 4, 5, 6, 7, 8],
							[5, 6, 7, 8],
						]);
						game.progressBoard(10);
						game.board.toggleTerrain();
						this.render(game.board.grid);
						break;
					case this.buttons[10]: // instant worms
						game.board.randomizeGrid();

						game.board.algorithm.setRule([
							[2, 3, 4, 5, 6, 7, 8],
							[6, 7, 8],
						]);
						game.progressBoard(Math.ceil(Math.random() * 20));
						game.board.algorithm.setRule([
							[5, 6, 7, 8],
							[5, 6, 7, 8],
						]);
						game.progressBoard(Math.ceil(Math.random() * 10) + 2);

						game.board.algorithm.setRule([
							[3, 4, 5, 6, 7, 8],
							[5, 6, 7, 8],
						]);
						game.progressBoard(10);
						game.board.toggleTerrain();
						this.render(game.board.grid);
						break;
				}
			});
		});
	}

	addButtons(names) {
		for (const i in names) {
			if (names.hasOwnProperty(i)) {
				const btn = names[i];
				this.createDOMElement({
					content: `${btn}`,
					type: 'button',
					parent: this.container,
					CSSClasses: { btn: `btn-${+i + 1}` },
				});
			}
		}
		return document.querySelectorAll('btn');
	}
	render(grid) {
		for (let col = 0; col < grid.length; col++) {
			for (let row = 0; row < grid[col].length; row++) {
				const cell = grid[col][row];
				this.context.beginPath();
				this.context.fillStyle =
					cell.state === 0 ? 'white' : cell.state === 3 ? 'brown' : 'blue';
				this.context.rect(
					col * this.resolution,
					row * this.resolution,
					this.resolution,
					this.resolution
				);
				this.context.strokeStyle = 'white';
				this.context.fill();

				this.context.stroke();
			}
		}

		this.context.strokeStyle = 'blue';
		this.context.stroke;
	}
	createDOMElement({
		content = '',
		type = 'div',
		parent = document.body,
		CSSClasses = {},
		attributes = {},
	}) {
		let newElement = document.createElement(type);
		if (content) newElement.innerText = content;
		for (const key in CSSClasses) {
			if (CSSClasses.hasOwnProperty(key)) {
				newElement.classList.add(key, CSSClasses[key]);
			}
		}
		for (const key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				newElement.setAttribute(key, attributes[key]);
			}
		}
		parent.append(newElement);
	}
}
