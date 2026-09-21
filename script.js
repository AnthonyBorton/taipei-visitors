const stops = [...document.querySelectorAll(".stop-card")];
const toast = document.querySelector("#toast");
const startTime = document.querySelector("#start-time");
const savedChecks = JSON.parse(localStorage.getItem("taipei-day-checks") || "[]");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function updateProgress() {
  const completeCount = stops.filter((stop) => stop.classList.contains("is-complete")).length;
  document.querySelector("#progress-label").textContent = `${completeCount} of ${stops.length} done`;
  document.querySelector("#progress-bar").style.width = `${(completeCount / stops.length) * 100}%`;
}

function setStopComplete(stop, complete) {
  const button = stop.querySelector(".check-stop");
  stop.classList.toggle("is-complete", complete);
  button.textContent = complete ? "✓" : "○";
  button.setAttribute("aria-pressed", String(complete));
}

function saveChecks() {
  const checked = stops
    .filter((stop) => stop.classList.contains("is-complete"))
    .map((stop) => stop.dataset.stop);
  localStorage.setItem("taipei-day-checks", JSON.stringify(checked));
}

function updateTimes(offset) {
  stops.forEach((stop) => {
    const [hours, minutes] = stop.dataset.minutes
      ? [8, 30 + Number(stop.dataset.minutes)]
      : [8, 30];
    const totalMinutes = hours * 60 + minutes + Number(offset);
    const displayHours = Math.floor(totalMinutes / 60) % 24;
    const displayMinutes = totalMinutes % 60;
    stop.querySelector(".time-value").textContent =
      `${String(displayHours).padStart(2, "0")}:${String(displayMinutes).padStart(2, "0")}`;
  });
}

function sharePlan() {
  const shareText = "My one perfect day in Taipei: 5 stops, 3 bubble tea breaks, and a city loop.";
  if (navigator.share) {
    navigator.share({ title: "Taipei, in a day", text: shareText, url: window.location.href }).catch(() => {});
    return;
  }
  const copyPromise = navigator.clipboard
    ? navigator.clipboard.writeText(window.location.href)
    : Promise.reject(new Error("Clipboard API unavailable"));
  copyPromise.then(
    () => showToast("Plan link copied — send it to the group chat."),
    () => showToast("Your Taipei day is ready to share from the address bar.")
  );
}

document.querySelectorAll(".check-stop").forEach((button) => {
  const stop = button.closest(".stop-card");
  if (savedChecks.includes(stop.dataset.stop)) setStopComplete(stop, true);
  button.addEventListener("click", () => {
    setStopComplete(stop, !stop.classList.contains("is-complete"));
    saveChecks();
    updateProgress();
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;
    stops.forEach((stop) => {
      const visible = filter === "all" || stop.dataset.category.includes(filter);
      stop.classList.toggle("is-hidden", !visible);
    });
  });
});

document.querySelectorAll("[data-pace]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-pace]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    document.body.classList.toggle("slow-pace", button.dataset.pace === "slow");
    showToast(button.dataset.pace === "slow" ? "Slow mode on — linger a little longer." : "Balanced mode on — a little bit of everything.");
  });
});

startTime.addEventListener("change", (event) => {
  updateTimes(event.target.value);
  showToast(`Your day now starts at ${event.target.selectedOptions[0].textContent}.`);
});

document.querySelectorAll("[data-map-stop]").forEach((marker) => {
  marker.addEventListener("click", () => {
    const target = document.querySelector(`#stop-${marker.dataset.mapStop}`);
    document.querySelectorAll(".map-marker").forEach((item) => item.classList.remove("is-active"));
    marker.classList.add("is-active");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

document.querySelectorAll("[data-tea]").forEach((card) => {
  card.addEventListener("click", () => showToast(`${card.dataset.tea} added to your maybe-later list.`));
});

document.querySelectorAll("[data-action='share']").forEach((button) => button.addEventListener("click", sharePlan));
document.querySelectorAll("[data-action='save']").forEach((button) => {
  button.addEventListener("click", () => {
    saveChecks();
    showToast("Saved on this device — ready when your friends are.");
    button.innerHTML = "<span aria-hidden='true'>♥</span> Plan saved";
  });
});

document.querySelector(".theme-toggle").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("taipei-theme", nextTheme);
});

const savedTheme = localStorage.getItem("taipei-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
updateTimes(startTime.value);
updateProgress();
