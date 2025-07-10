import Timer from "./timer.js";

class TimerApp {
  constructor() {
    this.timer = new Timer();
    this.isConfigVisible = true;
    this.isCompactMode = false;

    // Elements
    this.timerElement = document.getElementById("timer");
    this.timerContainer = document.getElementById("timerContainer");
    this.timerHeader = document.getElementById("timerHeader");
    this.configControls = document.getElementById("configControls");
    this.buttonContainer = document.getElementById("buttonContainer");
    this.toggleConfigBtn = document.getElementById("toggleConfigBtn");
    this.totalTimeInput = document.getElementById("totalTime");
    this.reminderTimeInput = document.getElementById("reminderTime");
    this.reminderDurationInput = document.getElementById("reminderDuration");
    this.flashEffectCheckbox = document.getElementById("flashEffect");
    this.soundEffectCheckbox = document.getElementById("soundEffect");
    this.startBtn = document.getElementById("startBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.alertSound = document.getElementById("alertSound");
    this.footer = document.getElementById("appFooter");

    // Bind event listeners
    this.startBtn.addEventListener("click", () => this.startTimer());
    this.resetBtn.addEventListener("click", () => this.resetTimer());
    this.toggleConfigBtn.addEventListener("click", () => this.toggleConfig());

    // Kiểm tra thời hạn sử dụng
    // this.checkLicense();

    // Initialize
    this.updateTimerDisplay();
  }

  // Kiểm tra thời hạn sử dụng
  checkLicense() {
    const startDate = new Date("2025-07-09T00:00:00");
    const currentDate = new Date();
    const endDate = new Date(startDate.getTime() + 72 * 60 * 60 * 1000); // 72 giờ sau ngày bắt đầu

    if (currentDate < startDate || currentDate > endDate) {
      alert("Thời hạn sử dụng đã hết. Ứng dụng sẽ đóng.");
      window.electronAPI.closeApp();
    }
  }

  // Toggle config visibility and window size
  toggleConfig() {
    this.isConfigVisible = !this.isConfigVisible;
    this.isCompactMode = !this.isConfigVisible;

    if (this.isConfigVisible) {
      this.configControls.classList.remove("hidden");
      this.buttonContainer.classList.remove("hidden");
      this.timerHeader.classList.remove("hidden");
      this.toggleConfigBtn.textContent = "⚙️";
      this.toggleConfigBtn.classList.add("visible");
      this.timerContainer.classList.remove("compact-mode");
      document.body.style.justifyContent = "flex-start";

      // Resize window to normal
      window.electronAPI.resizeWindowNormal();
    } else {
      this.configControls.classList.add("hidden");
      this.buttonContainer.classList.add("hidden");
      this.timerHeader.classList.add("hidden");
      this.toggleConfigBtn.textContent = "🔧";
      this.timerContainer.classList.add("compact-mode");
      document.body.style.justifyContent = "center"; // Căn giữa theo chiều dọc

      // Resize window to compact
      window.electronAPI.resizeWindowCompact();

      // Đảm bảo timer và nút config được căn giữa
      setTimeout(() => {
        // Đợi một chút để animation hoàn thành
        this.timerElement.style.textAlign = "center";
        this.timerContainer.style.margin = "0 auto";
      }, 100);
    }
  }

  // Update timer display
  updateTimerDisplay() {
    this.timerElement.textContent = this.timer.formatTime(
      this.timer.remainingSeconds
    );
  }

  // Start timer
  startTimer() {
    if (this.timer.isRunning) return;

    const totalMinutes = parseInt(this.totalTimeInput.value) || 25;
    const reminderMinutes = parseInt(this.reminderTimeInput.value) || 5;

    // Disable inputs
    this.startBtn.disabled = true;
    this.resetBtn.disabled = false;
    this.totalTimeInput.disabled = true;
    this.reminderTimeInput.disabled = true;
    this.reminderDurationInput.disabled = true;

    // Update UI
    this.timerContainer.classList.add("timer-running");
    this.timerElement.classList.add("running");
    document.body.classList.add("timer-running");
    this.toggleConfigBtn.classList.add("always-visible");
    this.toggleConfigBtn.style.opacity = "1";

    // Switch to compact mode if not already
    if (this.isConfigVisible) {
      this.toggleConfig();
    }

    // Start the timer
    this.timer.start(
      totalMinutes,
      reminderMinutes,
      (timeString) => {
        this.timerElement.textContent = timeString;
      },
      (isFinal) => {
        this.showReminder(isFinal);
      },
      () => {
        this.endTimer();
      }
    );
  }

  // Show reminder notification
  showReminder(isFinal = false) {
    const reminderDuration = parseInt(this.reminderDurationInput.value) || 5;

    // Flash effect
    if (this.flashEffectCheckbox.checked) {
      this.timerContainer.classList.add("flash");
      window.electronAPI.showNotification(
        "Nhắc nhở",
        isFinal ? "Hết giờ!" : "Sắp hết giờ!"
      );
    }

    // Sound effect
    if (this.soundEffectCheckbox.checked) {
      this.timer.playAlertSound(this.alertSound, reminderDuration);
    }

    // Stop reminder after duration
    setTimeout(() => {
      this.timerContainer.classList.remove("flash");
      if (this.timer.reminderInterval) {
        clearInterval(this.timer.reminderInterval);
        this.timer.reminderInterval = null;
      }
    }, reminderDuration * 1000);
  }

  // End timer
  endTimer() {
    // Enable inputs
    this.startBtn.disabled = false;
    this.totalTimeInput.disabled = false;
    this.reminderTimeInput.disabled = false;
    this.reminderDurationInput.disabled = false;

    // Update UI
    // this.timerContainer.classList.remove("timer-running");
    // this.timerElement.classList.remove("running");
    // document.body.classList.remove("timer-running");

    // Switch back to normal mode
    // if (!this.isConfigVisible) {
    //   this.toggleConfig();
    // }
  }

  // Reset timer
  resetTimer() {
    this.timer.reset();
    this.updateTimerDisplay();
    this.timerContainer.classList.remove("flash");
    this.resetBtn.disabled = true;

    // Enable inputs that were disabled
    this.totalTimeInput.disabled = false;
    this.reminderTimeInput.disabled = false;
    this.reminderDurationInput.disabled = false;

    this.startBtn.disabled = false;

    // Switch back to normal mode
    if (!this.isConfigVisible) {
      this.toggleConfig();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new TimerApp();
  console.log("App initialized");
});
