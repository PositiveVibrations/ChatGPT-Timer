document.addEventListener('DOMContentLoaded', function() {
    // Initial check for an active timer
    chrome.storage.local.get('endTime', function(data) {
        if (data.endTime && new Date(data.endTime) > new Date()) {
            displayTimer(new Date(data.endTime));
        } else {
            displayInitialNoTimerMessage();
        }
    });

    // Event listener for the Show Timer button
    const showTimerButton = document.getElementById('showTimerButton');
    const messageDisplay = document.getElementById('messageDisplay');

    showTimerButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length === 0 || !tabs[0].id) {
                // No active tab found
                displayNoTimerMessage(messageDisplay, 'No active tab found.');
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, {action: "checkForTimer"}, function(response) {
                if (chrome.runtime.lastError) {
                    // Handle potential error when sending message
                    displayNoTimerMessage(messageDisplay, 'Error: ' + chrome.runtime.lastError.message);
                    return;
                }

                if (response && response.timerFound) {
                    displayTimerSetMessage(messageDisplay);
                } else {
                    displayNoTimerMessage(messageDisplay, 'No timers found on the page.');
                }
            });
        });
    });
});

function displayTimerSetMessage(element) {
    element.textContent = 'A timer has been set on the page.';
}

function displayNoTimerMessage(element, message) {
    element.textContent = message;
}

function displayInitialNoTimerMessage() {
    const noTimerMessage = document.getElementById('messageDisplay');
    noTimerMessage.textContent = 'No timers are currently set.';
}


function displayTimer(endTime) {
    const timerElement = document.createElement('div');
    timerElement.id = 'timerDisplay';
    document.body.appendChild(timerElement);
    updateTimerDisplay(endTime, timerElement);
}

function updateTimerDisplay(endTime, element) {
    const interval = setInterval(function() {
        const now = new Date();
        const remainingTime = calculateTimeRemaining(endTime);
        if (remainingTime <= 0) {
            clearInterval(interval);
            element.textContent = 'Timer ended';
            return;
        }
        element.textContent = formatTime(remainingTime);
    }, 1000);
}

function calculateTimeRemaining(endTime) {
    const now = new Date();
    const difference = endTime.getTime() - now.getTime();
    return Math.max(difference, 0);
}

function formatTime(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}
