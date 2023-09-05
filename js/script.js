const themeSwitch = document.getElementById("theme-btn");

const timeDisplay = document.getElementById("time");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const workState = document.getElementById("work");
const breakState = document.getElementById("break");
const circle = document.getElementById("base-timer-path-remaining");

const taskInput = document.getElementById("task");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

// themeSwitch
let darkTheme = localStorage.getItem('dark-theme');
let body = document.body;
const enableDarkTheme = () => {
	themeSwitch.classList.replace('fa-sun', 'fa-moon');
	body.classList.add('dark-theme');
	localStorage.setItem('dark-theme', 'enabled');
}
const disableDarkTheme = () => {
	themeSwitch.classList.replace('fa-moon', 'fa-sun');
	body.classList.remove('dark-theme');
	localStorage.setItem('dark-theme', 'disabled');
}
function switchTheme() {
	darkTheme = localStorage.getItem('dark-theme');
	if (darkTheme === 'disabled') {
		enableDarkTheme();
	} else {
		disableDarkTheme();
	}
}

if (darkTheme === 'enabled') { //true/false
	enableDarkTheme();
}
else {
	disableDarkTheme();
}
themeSwitch.addEventListener("click", switchTheme);


// Pomodoro Timer
//innit
workState.style.color = "red";
workState.style.textShadow = "0 0 30px #e60073";
let timer;
let timeLimit = 1500; //--Work Duration--
let timePassed = 0;
let timeInSeconds = timeLimit - timePassed;
let isTimerRunning = false;
let state = "work";
let soundEffect = new Audio('sound/ding.mp3'); //sound effect

function updateTimer() {
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = timeInSeconds % 60;
	timeDisplay.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Circle Animation
function calculateTimeFraction() {
	return timeInSeconds / timeLimit;
}
function setCircleDasharray() {
	const circleDasharray = `${(calculateTimeFraction() * 283).toFixed(0)} 283`;
	document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function startTimer() {
	if (!isTimerRunning) {
		timer = setInterval(() => {
			if (timeInSeconds > 0) {
				timePassed++;
				timeInSeconds--;
				updateTimer();
				setCircleDasharray();
			} else {
				clearInterval(timer);
				isTimerRunning = false;
				if (state == "work") {
					timeLimit = 300; //--Break Duration--
					timePassed = 0;
					timeInSeconds = timeLimit - timePassed;
					state = "break";

					workState.removeAttribute('style');
					breakState.style.color = "green";
					breakState.style.textShadow = "0 0 30px rgba(89, 202, 89, 0.555)";
					circle.style.color = "green";
				} else if (state == "break") {
					timeLimit = 1500;
					timePassed = 0;
					timeInSeconds = timeLimit - timePassed;
					state = "work";

					breakState.removeAttribute('style');
					workState.style.color = "red";
					workState.style.textShadow = "0 0 30px #e60073";
					circle.style.color = "red";
				}
				updateTimer();
				setCircleDasharray();
				startButton.innerHTML = "Start";
				soundEffect.play();
			}
		}, 1000);

		isTimerRunning = true;
		startButton.innerHTML = "Pause";
	} else {
		clearInterval(timer);
		isTimerRunning = false;
		startButton.innerHTML = "Resume";
	}
}

function resetTimer() {
	clearInterval(timer);
	if(state == "work"){
		timeLimit = 1500;
		timePassed = 0;
	}else if(state == "break"){
		timeLimit = 300;
		timePassed = 0;
	}
	isTimerRunning = false;
	timeInSeconds = timeLimit - timePassed;

	startButton.innerHTML = "Start";
	updateTimer();
	setCircleDasharray();
}

function setWork() { 
	if(state == "break"){
		clearInterval(timer);
		timeLimit = 1500;
		timePassed = 0;
		timeInSeconds = timeLimit - timePassed;
		isTimerRunning = false;
		startButton.innerHTML = "Start";
		state = "work";

		breakState.removeAttribute('style');
		workState.style.color = "red";
		workState.style.textShadow = "0 0 30px #e60073";
		circle.style.color = "red";

		updateTimer();
		setCircleDasharray();
	}
}

function setBreak(){
	if(state == "work"){
		clearInterval(timer);
		timeLimit = 300;
		timePassed = 0;
		timeInSeconds = timeLimit - timePassed;
		isTimerRunning = false;
		startButton.innerHTML = "Start";
		state = "break";

		workState.removeAttribute('style');
		breakState.style.color = "green";
		breakState.style.textShadow = "0 0 30px rgba(89, 202, 89, 0.555)";
		circle.style.color = "green";

		updateTimer();
		setCircleDasharray();
	}

}

startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);
workState.addEventListener("click", setWork);
breakState.addEventListener("click", setBreak);

updateTimer(); //for after reload page
setCircleDasharray();


// To-Do List
function addTask() {
	const taskText = taskInput.value.trim();
	if (taskText !== "") {
		const li = document.createElement("li");

		li.innerHTML = `
          <input type="checkbox" name="${taskText}">
          <label><h5>${taskText}</h5></label>
          <button class="delete-task-btn"><i class="fa fa-xmark"></i></button>
      `;
		taskList.appendChild(li);
		taskInput.value = "";

		const deleteButton = li.querySelector("button");
		deleteButton.addEventListener("click", function () {
			taskList.removeChild(li);
		});

		const checkButton = li.querySelector(`input[name="${taskText}"]`);
		const labelCheckbox = li.children[1];

		checkButton.addEventListener("change", function () {
			if (checkButton.checked) {
				labelCheckbox.style.textDecoration = "line-through";
			} else {
				labelCheckbox.removeAttribute('style');
			}
		})

		labelCheckbox.addEventListener("click", function () {
			if (!checkButton.checked) {
				checkButton.checked = true;
				labelCheckbox.style.textDecoration = "line-through";
			} else {
				checkButton.checked = false;
				labelCheckbox.removeAttribute('style');
			}
		});

	}
}

taskInput.addEventListener("keypress", function(event) {
	if (event.key == "Enter") {
		event.preventDefault();
		addTaskButton.click();
	}
});

addTaskButton.addEventListener("click", addTask);
