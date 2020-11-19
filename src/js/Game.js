import Display from './Display.js';
import Board from './Board.js';
import { display } from './gol-oop.js';

export default class Game {
	constructor(Board) {
		this.board = Board;
		this.isLooped = false;
		this.notGOL = false;
		this.terrainOn = false;
	}
	progressBoard(iterations = 1) {
		for (let i = 0; i < iterations; i++) {
			const currentGrid = [...this.board.grid];
			const newBoard = new Board(this.board.algorithm);
			Board.history[++Game.round] = this.board;

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
			Board.history[++Game.round] = this.board;
			this.board = newBoard;
		}
		let btn = display.buttons[1];
		if (btn.getAttribute('disabled') !== null) btn.toggleAttribute('disabled');
	}

	regressBoard() {
		if (Game.round > 0) {
			this.board = Board.history[Game.round--];
		}
	}

	static round = -1;
}
