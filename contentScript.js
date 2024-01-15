// Create and style the floating timer element
function createFloatingTimer() {
    const timerDiv = document.createElement('div');
    timerDiv.id = 'floating-timer';
    timerDiv.textContent = '02:00';
    timerDiv.style.position = 'fixed';
    timerDiv.style.right = '20px';
    timerDiv.style.top = '20px';
    timerDiv.style.backgroundColor = 'red';
    timerDiv.style.color = 'white';
    timerDiv.style.padding = '10px';
    timerDiv.style.borderRadius = '5px';
    timerDiv.style.cursor = 'pointer';
    document.body.appendChild(timerDiv);

    // Add click event to close the timer
    timerDiv.addEventListener('click', function() {
        document.body.removeChild(timerDiv);
    });

    return timerDiv;
}

// Initialize and start the countdown
function startCountdown(duration, display) {
    let timer = duration, minutes, seconds;
    const countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdown);
            display.textContent = 'ChatGPT 4 Ready';
            display.style.backgroundColor = 'green';
        }
    }, 1000);
}

// Function to be called on page load or specific event
function initializeTimer() {
    const floatingTimer = createFloatingTimer();
    const duration = 60; // Duration in seconds (1 minute)
    startCountdown(duration, floatingTimer);
}

// Call initializeTimer() to start
initializeTimer();