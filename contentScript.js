function calculateTimeRemaining(futureTimeStr) {
    const now = new Date();
    const futureTime = new Date();

    const [time, modifier] = futureTimeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    // Convert 12-hour to 24-hour format
    if (modifier.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
    } else if (modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }

    futureTime.setHours(hours);
    futureTime.setMinutes(minutes);
    futureTime.setSeconds(0);

    let differenceInSeconds = (futureTime - now) / 1000;
    return Math.max(differenceInSeconds, 0); // Ensure non-negative
}

function initializeTimerWithFutureTime(futureTimeStr) {
    const durationInSeconds = calculateTimeRemaining(futureTimeStr);
    const floatingTimer = createFloatingTimer();
    startCountdown(durationInSeconds, floatingTimer);
}

// Create and style the floating timer element
function createFloatingTimer() {
    const timerDiv = document.createElement('div');
    timerDiv.id = 'floating-timer';
    timerDiv.textContent = '00:00';
    timerDiv.style.position = 'fixed';
    timerDiv.style.top = '10px';
    timerDiv.style.left = '50%'; // Center horizontally
    timerDiv.style.transform = 'translateX(-50%)'; // Adjust for centering
    timerDiv.style.backgroundColor = 'red';
    timerDiv.style.color = 'white';
    timerDiv.style.padding = '10px';
    timerDiv.style.borderRadius = '5px';
    timerDiv.style.cursor = 'pointer';
    timerDiv.style.zIndex = '1000'; // Ensure it's above other elements
    document.body.appendChild(timerDiv);

    // Add click event to close the timer
    timerDiv.addEventListener('click', function() {
        document.body.removeChild(timerDiv);
    });

    return timerDiv;
}

// Initialize and start the countdown
function startCountdown(duration, display) {
    let timer = duration, hours, minutes, seconds;
    const countdown = setInterval(function () {
        hours = parseInt(timer / 3600, 10); // Get hours
        minutes = parseInt((timer % 3600) / 60, 10); // Get minutes
        seconds = parseInt(timer % 60, 10); // Get seconds

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + ":" + minutes + ":" + seconds; // Display HH:MM:SS

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
    const duration = 120; // Duration in seconds (1 minute)
    startCountdown(duration, floatingTimer);
}
//add a flag to check if the timer is already initialized
let timerInitialized = false;

function extractTime() {
    const elements = document.querySelectorAll('.flex.items-center.gap-6');
    let extractedTime = null;

    elements.forEach((element) => {
        const elementText = element.textContent;
        const timeRegex = /(\d{1,2}:\d{2} [APap][Mm])/;
        const timeMatch = elementText.match(timeRegex);
        
        if (timeMatch) {
            // Add a clock emoji next to the detected time (only once)
            if (extractedTime === null) {
                extractedTime = timeMatch[0] + 'Set Timer ⏰';
                
            }
        }
    });

    return extractedTime;
}

//// Global flag to indicate if the clock emoji has been added
let clockEmojiAdded = false;

// Updated extractTime function
function extractTime() {
    const elements = document.querySelectorAll('.flex.items-center.gap-6');
    for (const element of elements) {
        const timeRegex = /(\d{1,2}:\d{2} [APap][Mm])/;
        const timeMatch = element.textContent.match(timeRegex);
        if (timeMatch) {
            return timeMatch[0];
        }
    }
    return null;
}

// Updated MutationObserver logic
function initializeMutationObserver() {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const extractedTime = extractTime();
                if (extractedTime && !clockEmojiAdded) {
                    clockEmojiAdded = true;
                    const elements = document.querySelectorAll('.flex.items-center.gap-6');
                    const clockEmoji = document.createElement('span');
                    clockEmoji.textContent = ' Set Timer ⏰';
                    elements[0].appendChild(clockEmoji);

                    clockEmoji.addEventListener('click', function() {
                        initializeTimerWithFutureTime(extractedTime);
                    });
                }
            }
        }
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
}

window.addEventListener('load', initializeMutationObserver);

//here