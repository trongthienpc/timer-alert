class Timer {
    constructor() {
        this.countdown = null;
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.isRunning = false;
        this.reminderTimeout = null;
        this.reminderInterval = null;
    }

    // Format time as HH:MM:SS
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    }

    // Start timer
    start(totalMinutes, reminderMinutes, onTick, onReminder, onEnd) {
        if (this.isRunning) return;

        this.totalSeconds = totalMinutes * 60;
        this.remainingSeconds = this.totalSeconds;

        // Set reminder timeout
        if (reminderMinutes < totalMinutes) {
            const reminderSeconds = (totalMinutes - reminderMinutes) * 60;
            this.reminderTimeout = setTimeout(() => {
                onReminder(false);
            }, reminderSeconds * 1000);
        }

        onTick(this.formatTime(this.remainingSeconds));

        this.isRunning = true;

        this.countdown = setInterval(() => {
            this.remainingSeconds--;
            onTick(this.formatTime(this.remainingSeconds));

            if (this.remainingSeconds <= 0) {
                this.end();
                onReminder(true); // Final alert
                onEnd();
            }
        }, 1000);
    }

    // End timer
    end() {
        clearInterval(this.countdown);
        clearTimeout(this.reminderTimeout);
        this.isRunning = false;
    }

    // Reset timer
    reset() {
        this.end();
        this.remainingSeconds = 0;
        if (this.reminderInterval) {
            clearInterval(this.reminderInterval);
            this.reminderInterval = null;
        }
    }

    // Play alert sound repeatedly
    playAlertSound(audioElement, duration) {
        audioElement.play().catch(e => console.log('Audio play failed:', e));

        this.reminderInterval = setInterval(() => {
            audioElement.play().catch(e => console.log('Audio play failed:', e));
        }, 1000);

        setTimeout(() => {
            if (this.reminderInterval) {
                clearInterval(this.reminderInterval);
                this.reminderInterval = null;
            }
        }, duration * 1000);
    }
}

export default Timer;