document.addEventListener('DOMContentLoaded', function() {
    loadSettings();

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
                displayNoTimerMessage(messageDisplay, 'No active tab found.');
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, {action: "checkForTimer"}, function(response) {
                if (chrome.runtime.lastError) {
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

    document.getElementById('soundSelect').addEventListener('change', saveSettings);
    document.getElementById('confettiToggle').addEventListener('change', saveSettings);
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

// ... (rest of your existing functions for timer display and calculation)

// New functions for handling settings
function saveSettings() {
    const sound = document.getElementById('soundSelect').value;
    const confettiEnabled = document.getElementById('confettiToggle').checked;

    chrome.storage.local.set({ sound, confettiEnabled }, function() {
        console.log('Settings saved');
    });
}

function loadSettings() {
    chrome.storage.local.get(['sound', 'confettiEnabled'], function(items) {
        if (items.sound) {
            document.getElementById('soundSelect').value = items.sound;
        }
        document.getElementById('confettiToggle').checked = items.confettiEnabled !== false;
    });
}

// Call this function when the timer ends
function onTimerEnd() {
    chrome.storage.local.get(['sound', 'confettiEnabled'], function(items) {
        if (items.sound) {
            const audio = new Audio('../assets/' + items.sound); // Update path
            audio.play();
        }

        if (items.confettiEnabled) {
            startConfetti();
        }
    });
}