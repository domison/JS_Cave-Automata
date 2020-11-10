'use strict';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// let canvas take up two thirds of browser responsively
canvas.width = window.innerWidth * (2 / 3);
canvas.height = window.innerHeight * (2 / 3);

// ensure that canvas is a square on all viewports and orientations
canvas.height <= canvas.width
	? (canvas.width = canvas.height)
	: (canvas.height = canvas.width);

// for now resolution and with it cell size sits at 1/64
const resolution = Math.floor(canvas.width / 64);

const COLS = Math.floor(canvas.width / resolution);
const ROWS = Math.floor(canvas.height / resolution);

class Algorithm {
	constructor() {
		this.current = new Array([2, 3], [3]); // standard rule-set
	}

	setRule(rule = [[2, 3], [3]]) {
		this.current = rule;
	}
}

class Cell {
	constructor() {
		this.currentState = Math.floor(Math.random() * 2);
	}

	setState(state) {
		this.currentState = state;
	}
}

let grid = generateGrid();
requestAnimationFrame(loop);

function generateGrid() {
	return new Array(COLS)
		.fill(null)
		.map(() => new Array(ROWS).fill(null).map(() => new Cell()));
}

let rule = new Algorithm();

// apply B678/S345678
// rule.setRules([
// 	[6, 7, 8],
// 	[3, 4, 5, 6, 7, 8],
// ]);

function loop() {
	grid = nextGen(grid);
	render(grid);
	requestAnimationFrame(loop);
}

function render(grid) {
	for (let col = 0; col < grid.length; col++) {
		for (let row = 0; row < grid[col].length; row++) {
			const cell = grid[col][row];
			context.beginPath();
			context.rect(col * resolution, row * resolution, resolution, resolution);
			context.fillStyle = cell.currentState ? 'blue' : 'white';
			context.strokeStyle = 'grey';
			context.fill();
			context.stroke();
		}
	}
}

function countNeighbors(grid, col, row) {
	const currentGrid = grid;
	let numberOfNeighbors = 0;

	// find the direct neighbors of each cell
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			if (i == 0 && j == 0) {
				continue;
			}
			const x_cell = col + i;
			const y_cell = row + j;

			if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
				const currentNeighbor = currentGrid[col + i][row + j];
				numberOfNeighbors += currentNeighbor;
			}
		}
	}
	return numberOfNeighbors;
}

function applyRules(cellState, numberOfNeighbors, ...rules) {
	const survival = [...rules[0]];
	const revival = [...rules[1]];

	// standard rule set: survives with 2 and 3; revives with 3; else dies
	if (cellState === 1 && survival.includes(numberOfNeighbors)) {
		return 1;
	} else if (cellState === 0 && revival.includes(numberOfNeighbors)) {
		return 1;
	} else {
		return 0;
	}
}

function nextGen(grid, rules = [[2, 3], [3]]) {
	const currentGrid = grid.map(
		(array) => array.map((cell) => cell.currentState) // 0 or 1
	);
	const newGrid = grid;

	for (let col = 0; col < currentGrid.length; col++) {
		for (let row = 0; row < currentGrid[col].length; row++) {
			const cell = currentGrid[col][row]; // 0 or 1
			const numberOfNeighbors = countNeighbors(currentGrid, col, row);
			const newState = applyRules(cell, numberOfNeighbors, ...rules);

			newGrid[col][row].setState(newState);
		}
	}
	return newGrid;
}
// TODO: Refactor grid/currentGen so it can advanced by steps
// TODO: create way for user to apply B678/S345678 for cave-building algorithm
