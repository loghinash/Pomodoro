const boardButton = document.querySelector(".board__action-button");
const pomodoroModes = document.querySelectorAll(".board__header p");
const displayTime = document.querySelector(".board__time-left");
let startTime;
let duration = 1000 * 60 * 25; // 25 min default
let interval = null;

document.addEventListener("DOMContentLoaded", () => {
  handlePomodoroModes();
});

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
      } else if (mode.classList.contains("board__pause-time-item")) {
        mode.classList.add("board__pause-time-item--active");
        displayTime.textContent = `${mode.dataset.pause}:00`;
      }
    });
  });
}

function beginStudy() {
  startTime = Date.now();
  interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  let elapsed = Date.now() - startTime; // 1000ms = 1s
  let remaining = duration - elapsed;
  console.log(remaining);

  if (remaining <= 0) {
    endStudy();
  } else {
    const minutes = Math.ceil(remaining / 1000 / 60);
    const seconds = Math.ceil((remaining / 1000) % 60);
    document.querySelector(".board__time-left").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

function endStudy() {
  clearInterval(interval);
  console.log("End Study");
}

boardButton.addEventListener("click", () => {
  if (boardButton.textContent === "Start") {
    beginStudy();
    boardButton.textContent = "Stop";
  } else {
    endStudy();
    boardButton.textContent = "Start";
  }
});
