const SQUARE_DIMENSION = 300; // 300px x 300px canvas
const STEP_LENGTH = 2; // a px value for each random(left, right, top, bottom) movement

// how many times we want to move, 50000 by default
let steps = 50000;
let lineColor = "#32ad16";

// handle change of number of steps, and print the current value
const stepsSlider = document.querySelector(".range__slider");
const sliderOutput = document.querySelector(".range__label__steps");

// append default steps number
sliderOutput.innerHTML = steps;
stepsSlider.value = steps;

stepsSlider.oninput = function() {
	sliderOutput.innerHTML = this.value;
	steps = this.value;
};

// canvas setup
const canvas = document.querySelector(".random-map");
const context = canvas.getContext("2d");

canvas.height = SQUARE_DIMENSION;
canvas.width = SQUARE_DIMENSION;

// we want to start at random position, so we choose x and y
const random = max => Math.floor(Math.random() * max);
const getStartingPosition = () => [
	random(SQUARE_DIMENSION),
	random(SQUARE_DIMENSION),
];
let x,
	y = 0;

// this object has function as properties,
// each function checks if we're about to cross a border
// * true - stop moving in that direction
// * false - move accordingly (by STEP_LENGTH)
const moveToNextStep = {
	left: () => {
		if (x <= STEP_LENGTH) return;
		x -= STEP_LENGTH;
	},
	right: () => {
		if (x >= SQUARE_DIMENSION - STEP_LENGTH) return;
		x += STEP_LENGTH;
	},
	top: () => {
		if (y >= SQUARE_DIMENSION - STEP_LENGTH) return;
		y += STEP_LENGTH;
	},
	bottom: () => {
		if (y <= STEP_LENGTH) return;
		y -= STEP_LENGTH;
	},
};

// this function will be used to generate random directions we walk to
const directions = Object.keys(moveToNextStep);
const getNextDirection = () => directions[random(directions.length)];

// And here it is! The randomWalk function.
// it takes the color of line
const randomWalk = (isFirstCall = false) => {
	// don't use rerender animation on the first render
	if (!isFirstCall) {
		canvas.classList.remove("random-map--rerender");
		setTimeout(() => {
			canvas.classList.add("random-map--rerender");
		}, 20);
	}

	[x, y] = getStartingPosition();
	// clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	// set background to some nice blue color, so it reminds ocean
	context.fillStyle = "#184da3";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// start the line, and set color
	context.beginPath();
	context.moveTo(x, y);
	context.strokeStyle = lineColor;

	// for each step calculate direction,
	// and move the line
	for (let i = 0; i <= steps; i++) {
		const next_direction = getNextDirection();
		moveToNextStep[next_direction]();
		context.lineTo(x, y);
	}

	// after all moves are calculated, draw the final line
	context.stroke();
};

randomWalk(true);
