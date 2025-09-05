const boardButton = document.querySelector(".board__action-button");
const pomodoroModes = document.querySelectorAll(".board__header p");
const displayTime = document.querySelector(".board__time-left");
let startTime;

let duration = 1000 * 10; // 25 min default
let isPause = false;
let interval = null;

const bell = new Audio("./assets/bell.mp3");
document.addEventListener("DOMContentLoaded", () => {
  handlePomodoroModes();
});

function runSound(effect) {
  effect.currentTime = 0;
  effect.play();
}

function clearActiveClasses() {
  pomodoroModes.forEach((mode) =>
    mode.classList.remove("board__focus-time-item--active", "board__pause-time-item--active")
  );
}

function handlePomodoroModes() {
  pomodoroModes.forEach((mode) => {
    mode.addEventListener("click", () => {
      clearActiveClasses();
      if (mode.classList.contains("board__focus-time-item")) {
        mode.classList.add("board__focus-time-item--active");
        displayTime.textContent = `${mode.dataset.minutes}:00`;
        duration = 1000 * 60 * mode.dataset.minutes;
        // console.log("FOCUS (duration):", duration);
      } else if (mode.classList.contains("board__pause-time-item")) {
        mode.classList.add("board__pause-time-item--active");
        displayTime.textContent = `${mode.dataset.pause}:00`;
        duration = 1000 * 60 * mode.dataset.pause;
        // console.log("PAUSE (duration):", duration);
      }
    });
  });
}

function beginStudy() {
  startTime = Date.now();
  interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  let elapsed = Date.now() - startTime;
  let remaining = duration - elapsed;
  // console.log(remaining);

  if (remaining <= 0) {
    runSound(bell);
    endStudy();
    if (!isPause) {
      setPause();
    } else {
      setRound();
    }
    isPause = !isPause;
  } else {
    const minutes = Math.floor(remaining / 1000 / 60);
    const seconds = Math.ceil((remaining / 1000) % 60);
    displayTime.textContent = `${seconds === 60 ? minutes + 1 : minutes}:${
      seconds === 60 ? "00" : seconds.toString().padStart(2, "0")
    }`;
  }
}

function resetDisplayTime() {
  const currentMode = Array.from(pomodoroModes).filter(
    (mode) =>
      mode.classList.contains("board__focus-time-item--active") ||
      mode.classList.contains("board__pause-time-item--active")
  )[0];
  if (currentMode.parentElement.classList.contains("board__focus-time")) {
    displayTime.textContent = `${currentMode.dataset.minutes}:00`;
    duration = 1000 * 60 * currentMode.dataset.minutes;
    // console.log("RESETDISPLAYTIME (duration):", duration);
  } else if (currentMode.parentElement.classList.contains("board__pause-time")) {
    displayTime.textContent = `${currentMode.dataset.pause}:00`;
    duration = 1000 * 60 * currentMode.dataset.pause;
    // console.log("RESETDISPLAYTIME (duration):", duration);
  }
}

function endStudy() {
  clearInterval(interval);
  boardButton.textContent = "Start";
  // console.log("End Study");
}

function setRound() {
  const currentMode = Array.from(pomodoroModes).filter(
    (mode) =>
      mode.classList.contains("board__focus-time-item--active") ||
      mode.classList.contains("board__pause-time-item--active")
  )[0];
  displayTime.textContent = `${currentMode.dataset.minutes}:00`;
  duration = 1000 * 60 * currentMode.dataset.minutes;
}

function setPause() {
  const currentMode = Array.from(pomodoroModes).filter(
    (mode) =>
      mode.classList.contains("board__focus-time-item--active") ||
      mode.classList.contains("board__pause-time-item--active")
  )[0];
  displayTime.textContent = `${currentMode.dataset.pause}:00`;
  duration = 1000 * 60 * currentMode.dataset.pause;
  // console.log("TAKEPAUSE (DURATION):", duration);
}

boardButton.addEventListener("click", () => {
  if (boardButton.textContent === "Start") {
    beginStudy();
    boardButton.textContent = "Stop";
  } else {
    endStudy();
    resetDisplayTime(); // lose streaks
    boardButton.textContent = "Start";
  }
});
