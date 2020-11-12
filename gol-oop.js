'use strict';

class Display {
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
		];
		this.buttons = this.addButtons(this.btnNames);
		this.buttons = document.querySelectorAll('button');
		this.buttons.forEach((btn) => {
			return btn.addEventListener('click', (event) => {
				switch (event.target) {
					case this.buttons[0]: // play
						if (btn.textContent != 'Play') {
							btn.textContent = 'Play';
						} else {
							btn.textContent = 'Stop';
						}
						loop();
						break;
					case this.buttons[1]: // step
						game.regressBoard();
						this.render(game.board.grid);
						break;
					case this.buttons[2]: // conway
						game.board.algorithm.setRule([[2, 3], [3]]);
						game.progressBoard(20);
						this.render(game.board.grid);
						break;
					case this.buttons[3]: // caive1
						// apply B678/S345678
						game.board.algorithm.setRule([
							// [2, 3, 4, 5, 6, 7, 8],
							// [5, 6, 7, 8],
							[3, 4, 5, 6, 7, 8],
							[5, 6, 7, 8],
						]);
						game.progressBoard(20);
						this.render(game.board.grid);
						break;
					case this.buttons[4]: // caive2
						// apply B5678/S5678
						game.board.algorithm.setRule([
							[5, 6, 7, 8],
							[5, 6, 7, 8],
						]);
						game.progressBoard(1);
						this.render(game.board.grid);
						break;
					case this.buttons[5]: // Terrain
						game.board.makeIntoTerrain();
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
	render(grid, factor = 0) {
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
				this.context.strokeStyle = 'grey';
				this.context.fill();
				this.context.stroke();
			}
		}
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
class Game {
	constructor(Board) {
		this.board = Board;
	}
	progressBoard(iterations = 1) {
		const currentGrid = [...this.board.grid];
		const newBoard = new Board(this.board.algorithm);
		for (let i = 0; i < iterations; i++) {
			for (let col = 0; col < currentGrid.length; col++) {
				for (let row = 0; row < currentGrid[col].length; row++) {
					const cell = currentGrid[col][row]; // 0 or 1
					if (cell.state === 3) {
						newBoard.grid[col][row].setState(3);
						continue;
					}

					const numberOfNeighbors = this.board.countNeighbors(
						currentGrid,
						col,
						row
					);
					const newState = this.board.applyRules(cell, numberOfNeighbors);
					newBoard.grid[col][row].setState(newState);
					newBoard.grid[col][row].state;
				}
			}
		}
		Board.history[++Game.round] = this.board;
		this.board = newBoard;
	}

	regressBoard() {
		if (Game.round > 0) {
			this.board = Board.history[Game.round--];
		}
	}

	static round = -1;
}
class Board {
	// stores boards in array, for redo, undo etc.
	static history = new Array();
	constructor(Algorithm) {
		this.algorithm = Algorithm;
		this.grid =
			Board.history.length != 0
				? Board.history[Game.round].grid
				: this.resetGrid();
		this.terrain = false;
	}
	randomizeGrid() {
		if (!this.terrain) {
			return (this.grid = new Array(display.cols)
				.fill(null)
				.map(() => new Array(display.rows).fill(null).map(() => new Cell(-1))));
		} else {
			return (this.grid = this.grid.map((row) =>
				row.map((cell) => {
					if (cell.state !== 3) {
						return new Cell(-1);
					}
					return cell;
				})
			));
		}
	}

	resetGrid() {
		return (this.grid = new Array(display.cols)
			.fill(null)
			.map(() => new Array(display.rows).fill(null).map(() => new Cell(0))));
	}

	makeIntoTerrain() {
		return (this.grid = this.grid.map((row) =>
			row.map((cell) => {
				if (cell.state !== 0) {
					cell.state = 3;
				}
				return cell;
			})
		));
	}
	countNeighbors(grid, col, row) {
		let numberOfNeighbors = 0;

		// find the direct neighbors of each cell
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if (i == 0 && j == 0) {
					continue;
				}
				const x_cell = col + i;
				const y_cell = row + j;

				if (
					x_cell >= 0 &&
					y_cell >= 0 &&
					x_cell < display.cols &&
					y_cell < display.rows
				) {
					const currentNeighbor = grid[col + i][row + j].state;
					if (currentNeighbor !== 3) {
						numberOfNeighbors += currentNeighbor;
					}
				}
			}
		}
		return numberOfNeighbors;
	}

	applyRules(cell, numberOfNeighbors) {
		const survival = [...this.algorithm.current[0]];
		const revival = [...this.algorithm.current[1]];

		// standard rule set: survives with 2 and 3; revives with 3; else dies
		if (cell.state === 1 && survival.includes(numberOfNeighbors)) {
			return 1;
		} else if (cell.state === 0 && revival.includes(numberOfNeighbors)) {
			return 1;
		} else {
			return 0;
		}
	}
}
class Algorithm {
	constructor() {
		this.current = [[2, 3], [3]]; // standard rule-set
	}

	setRule(rule = [[2, 3], [3]]) {
		this.current = rule;
	}
}

class Cell {
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

let display = new Display();
let game = new Game(new Board(new Algorithm()));
game.board.grid = game.board.randomizeGrid();
display.render(game.board.grid);
game.progressBoard(1);
game.progressBoard(1);

// requestAnimationFrame(loop);

function loop() {
	game.progressBoard(1);
	display.render(game.board.grid);
	requestAnimationFrame(loop);
}

// TODO: fix issue with stop play button (Not possible to stop as of now, stacks)
// TODO: Make redo button workable or scrap it as not really essential to function
// TODO: Create short functions for instant cave and island making
