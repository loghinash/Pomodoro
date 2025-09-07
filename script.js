const boardButton = document.querySelector(".board__action-button");
const pomodoroModes = document.querySelectorAll(".board__header p");
const displayTime = document.querySelector(".board__time-left");
const notificationAlert = document.querySelector(".notification");
const bell = new Audio("./assets/bell.mp3");
let startTime;
let duration = 1000 * 60 * 25; // 25 min default
let isPause = false;
let interval = null;

document.addEventListener("DOMContentLoaded", () => {
  handlePomodoroModes();
  askUserForNotifications();
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
      endStudy();
      clearActiveClasses();
      if (mode.classList.contains("board__focus-time-item")) {
        mode.classList.add("board__focus-time-item--active");
        displayTime.textContent = `${mode.dataset.minutes}:00`;
        duration = 1000 * 60 * mode.dataset.minutes;
        isPause = false;
      } else if (mode.classList.contains("board__pause-time-item")) {
        mode.classList.add("board__pause-time-item--active");
        displayTime.textContent = `${mode.dataset.pause}:00`;
        duration = 1000 * 60 * mode.dataset.pause;
        isPause = true; // must commit
      }
    });
  });
}

function beginStudy() {
  startTime = Date.now();
  interval = setInterval(updateTimer, 200);
}

function updateTimer() {
  let elapsed = Date.now() - startTime;
  let remaining = duration - elapsed;
  // console.log(remaining);

  if (remaining <= 0) {
    runSound(bell);
    endStudy();
    sendNotification();
    if (!isPause) {
      setPause();
      isPause = true;
    } else {
      setRound();
      isPause = false;
    }
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
  } else if (currentMode.parentElement.classList.contains("board__pause-time")) {
    displayTime.textContent = `${currentMode.dataset.pause}:00`;
    duration = 1000 * 60 * currentMode.dataset.pause;
  }
}

function endStudy() {
  clearInterval(interval);
  isPause = false;
  boardButton.textContent = "Start";
}

function setRound() {
  const currentMode = Array.from(pomodoroModes).filter(
    (mode) =>
      mode.classList.contains("board__focus-time-item--active") ||
      mode.classList.contains("board__pause-time-item--active")
  )[0];
  if (currentMode.parentElement.classList.contains("board__pause-time")) {
    displayTime.textContent = `${currentMode.dataset.pause}:00`;
    duration = 1000 * 60 * currentMode.dataset.pause;
    isPause = true;
  } else if (currentMode.parentElement.classList.contains("board__focus-time")) {
    displayTime.textContent = `${currentMode.dataset.minutes}:00`;
    duration = 1000 * 60 * currentMode.dataset.minutes;
    isPause = false;
  }
}

function setPause() {
  const currentMode = Array.from(pomodoroModes).filter(
    (mode) =>
      mode.classList.contains("board__focus-time-item--active") ||
      mode.classList.contains("board__pause-time-item--active")
  )[0];
  displayTime.textContent = `${currentMode.dataset.pause}:00`;
  duration = 1000 * 60 * currentMode.dataset.pause;
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

async function askUserForNotifications() {
  setInterval(() => {
    notificationAlert.classList.add("notification--hidden");
  }, 15000);
  const permission = await Notification.requestPermission();
  if (permission === "granted" || permission === "denied") {
    notificationAlert.classList.add("notification--hidden");
  }
}

function sendNotification() {
  function getQuote(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  let message;
  if (!isPause) {
    message = getQuote(studyQuotes);
  } else {
    message = getQuote(breakQuotes);
  }
  new Notification("Pomodoro", {
    body: message,
    icon: "./assets/tomato.png",
  });
}

const studyQuotes = [
  "📖 Study session complete! Time for a break 👌",
  "🎉 Great job! Pomodoro finished — take a well-deserved break ☕",
  "Focus round complete ✅ Recharge time!",
  "Done! ✨ Rest for a bit before the next sprint.",
  "Well done! 🎯 Time to recharge with a short break.",
  "Focus sprint complete 🔥 Step away for a moment.",
  "Another Pomodoro down ✅ Rest your mind.",
  "Done focusing 🧘 Take a breather!",
  "Pomodoro finished 🏆 Take a short pause.",
  "Nice focus! 🌟 Time to rest your eyes.",
  "Another round done ✅ Recharge before the next.",
  "You crushed it 💪 Enjoy your break!",
  "Done studying 🎉 Breathe and relax.",
];
const breakQuotes = [
  "⏰ Break’s over! Back to focus 💪",
  "Hope you enjoyed your rest 🌿 Let’s dive back in!",
  "Time to refocus 🧠 Next Pomodoro starts now.",
  "Break finished ✅ Keep up the momentum 🚀",
  "Relax time is over ⏳ Back to work mode!",
  "⏰ Ready for the next round? Let’s go!",
  "Back to focus mode 🚀 You’ve got this.",
  "Let’s dive back in 📚 Another Pomodoro awaits.",
  "Focus time 🧠 Let’s keep the streak alive!",
  "⏳ Break time’s up — let’s get productive!",
  "Back in action ⚡ Start your next Pomodoro.",
  "Hope you’re refreshed 🌿 Time to focus again.",
  "Ready, set, study 📚 Your next session starts now.",
  "Break over ✅ Keep building that rhythm.",
];
