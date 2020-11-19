import Game from './Game.js';
import Cell from './Cell.js';
import { display, game } from './gol-oop.js';
export default class Board {
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
		Game.round--;
		return (this.grid = new Array(display.cols)
			.fill(null)
			.map(() => new Array(display.rows).fill(null).map(() => new Cell(0))));
	}

	toggleTerrain() {
		if (game.terrainOn) {
			return (this.grid = this.grid.map((row) =>
				row.map((cell) => {
					if (cell.state !== 0) {
						cell.state = 3;
					}
					return cell;
				})
			));
		} else {
			return (this.grid = this.grid.map((row) =>
				row.map((cell) => {
					if (cell.state === 3) {
						cell.state = 1;
					}
					return cell;
				})
			));
		}
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
					x_cell < display.cols - 0 &&
					y_cell < display.rows - 0
				) {
					const currentNeighbor = grid[col + i][row + j].state;
					if (currentNeighbor !== 3) {
						numberOfNeighbors += currentNeighbor;
					}
				} else {
					if (game.notGOL) {
						// if outside of frame
						return 6; // 3 neighbors means always alive in this case
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
