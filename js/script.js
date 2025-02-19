// DOM References
let items = document.querySelectorAll(".item");
const buttons = document.querySelectorAll("button");
const inputs = document.querySelectorAll("input");
const colorInput = document.querySelector(".color-picker");
const gridInput = document.querySelector("#size");
const indicator = document.querySelector("#indicator");
const boardTitle = document.querySelector("#boardtitle");

// Global Variables
let isMoving = false;
let isRandom = false;
let isErasing = false;
let currentColorValue = colorInput.value;
let currentGridValue = gridInput.value;

generateGrid(currentGridValue);

// EventListeners
attachEventListeners();

buttons.forEach((button) => {
	button.addEventListener("click", (e) => {
		changeButtonBehaviour(button);
	});
});

inputs.forEach((input) => {
	input.addEventListener("change", () => {
		changeInputBehaviour(input);
	});
});

// Functions
function setRandom() {
	return true;
}

function setErasing() {
	return true;
}

function colorGenerator(randomStatus, erasingStatus) {
	if (erasingStatus) return "#FFFFFF";
	if (randomStatus) {
		let colorValue = `rgb(${random(255)} ${random(255)} ${random(255)})`;
		return colorValue;
	}
	return currentColorValue;
}

function random(number) {
	return Math.round(Math.random() * number + 1);
}

function resetRandomEasing() {
	isRandom = false;
	isErasing = false;
}

function changeInputBehaviour(input) {
	if (input.id === "size") {
		console.log("Grid Size");
		let gridSize = filterValue(input.value);
		indicator.textContent = `${gridSize} X ${gridSize} Grid`;
		if (gridSize !== undefined) {
			console.log(gridSize);
			generateGrid(input.value);
		}
	} else if (input.id === "color-picker") {
		currentColorValue = input.value;
		resetRandomEasing();
		boardTitle.textContent = "Sketch Board - Normal Mode";
	}
}

function changeButtonBehaviour(button) {
	if (button.id == "random") {
		console.log("Random");
		isRandom = setRandom();
		isErasing = false;
		button.classList.add("active");
		buttons[1].classList.remove("active");
		boardTitle.textContent = "Sketch Board - Random Mode";
	} else if (button.id === "eraser") {
		console.log("Eraser");
		isErasing = setErasing();
		isRandom = false;
		button.classList.add("active");
		buttons[0].classList.remove("active");
		boardTitle.textContent = "Sketch Board - Eraser Mode";
	} else if (button.id === "clear") {
		console.log("Clear");
		buttons[0].classList.remove("active");
		buttons[1].classList.remove("active");
		items.forEach((item) => {
			item.style.backgroundColor = "#FFF";
		});
		boardTitle.textContent = "Sketch Board - Normal Mode";
	}
}

function changeBackgroundColor(target, isRandom, isErasing) {
	target.style.backgroundColor = colorGenerator(isRandom, isErasing);
	isMoving = true;
}

function filterValue(value) {
	if (+value % 1 !== 0) {
		alert(
			"Value passed is not an whole number. Pass a whole number between 1 and 100."
		);
	} else if (value < 1) {
		alert("Value passed lower than 1. Pass a whole number between 1 and 100.");
	} else if (value > 100) {
		alert(
			"Value passed higher than 100. Pass a whole number between 1 and 100."
		);
	} else {
		return +value;
	}
}

function generateGrid(gridSize) {
	const sketchBox = document.querySelector(".sketch-box");
	const parentMain = document.querySelector(".frame");

	gridLoop = gridSize * gridSize;

	let container = document.createElement("div");
	container.classList.toggle("sketch-box");

	let line;

	for (let i = 1; i <= gridLoop; i++) {
		if (i == 1 || i % gridSize === 1) {
			line = document.createElement("div");
			line.classList.toggle("plane");
		}
		let item = document.createElement("div");
		item.classList.toggle("item");
		line.appendChild(item);

		if (i % gridSize === 0) {
			container.appendChild(line);
		}
	}

	parentMain.replaceChild(container, sketchBox);

	items = document.querySelectorAll(".item");
	attachEventListeners();
}

function attachEventListeners() {
	items.forEach((item) => {
		// Default Listeners
		let itemFilled = false;

		item.addEventListener("mousedown", (e) => {
			console.log("Tap");
			changeBackgroundColor(e.target, isRandom, isErasing);
		});

		item.addEventListener("mousemove", (e) => {
			if (isMoving && !itemFilled) {
				changeBackgroundColor(e.target, isRandom, isErasing);
				itemFilled = true;
			}
		});

		item.addEventListener("mouseout", (e) => {
			itemFilled = false;
		});

		item.addEventListener("mouseup", () => {
			isMoving = false;
		});

		// Touch Listeners
		item.addEventListener("touchstart", (e) => {
			e.preventDefault();
			changeBackgroundColor(e.target, isRandom, isErasing);
		});

		item.addEventListener("touchmove", (e) => {
			e.preventDefault();
			if (isMoving && !itemFilled) {
				let touch = e.touches[0];
				let element = document.elementFromPoint(touch.clientX, touch.clientY);
				if (element) {
					changeBackgroundColor(element, isRandom, isErasing);
					// itemFilled = true;
				}
			}
		});

		item.addEventListener("touchend", (e) => {
			e.preventDefault();
			isMoving = false;
		});
	});
}
