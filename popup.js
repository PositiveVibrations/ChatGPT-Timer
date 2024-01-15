let countdownInterval;

document.addEventListener('DOMContentLoaded', function () {
    const nextUseTimeDiv = document.getElementById('nextUseTime');
    const countdownDiv = document.getElementById('countdown');

    function clearCountdownInterval() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    }

    function updateCountdown(targetTime) {
        clearCountdownInterval();
        
        countdownInterval = setInterval(() => {
            const now = new Date();
            const distance = new Date(targetTime) - now;

            if (distance < 0) {
                clearCountdownInterval();
                countdownDiv.textContent = "Countdown: 00:00:00";
                return;
            }

            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownDiv.textContent = `Countdown: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Load stored time and update countdown if it exists
    const storedTime = localStorage.getItem('chatGptTimer');
    if (storedTime) {
        nextUseTimeDiv.textContent = `Next use time: ${new Date(storedTime).toLocaleTimeString()}`;
        updateCountdown(storedTime);
    }

    // Listen for messages from contentScript.js
    chrome.runtime.onMessage.addListener(function (request) {
        if (request.action === 'updateTimer') {
            nextUseTimeDiv.textContent = `Next use time: ${new Date(request.time).toLocaleTimeString()}`;
            updateCountdown(request.time);
        }
    });
}
);
