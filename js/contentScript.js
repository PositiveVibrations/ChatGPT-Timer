// Calculates the remaining time until the specified future time
function calculateTimeRemaining(endTime) {
    const now = new Date();
    let differenceInSeconds = (endTime - now) / 1000;
    return Math.max(differenceInSeconds, 0); // Ensure non-negative
}

// Initializes the timer with a future time string
function initializeTimerWithFutureTime(futureTimeStr) {
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

    const futureTime = new Date();
    futureTime.setHours(hours);
    futureTime.setMinutes(minutes);
    futureTime.setSeconds(0);

    // Save end time to Chrome storage
    chrome.storage.local.set({ 'endTime': futureTime.getTime() });

    const remainingTime = calculateTimeRemaining(futureTime);
    const floatingTimer = createFloatingTimer();
    startCountdown(remainingTime, floatingTimer);
}

// Create and style the floating timer element
function createFloatingTimer() {
    const timerDiv = document.createElement('div');
    timerDiv.id = 'floating-timer';
    timerDiv.textContent = '00:00';
    timerDiv.style.position = 'fixed';
    timerDiv.style.top = '10px';
    timerDiv.style.left = '53%'; // Center horizontally
    timerDiv.style.transform = 'translateX(-50%)'; // Adjust for centering
    timerDiv.style.backgroundColor = 'red';
    timerDiv.style.color = 'white';
    timerDiv.style.padding = '10px';
    timerDiv.style.borderRadius = '5px';
    timerDiv.style.cursor = 'pointer';
    timerDiv.style.zIndex = '1000'; // Ensure it's above other elements
    document.body.appendChild(timerDiv);

    // Event to close the timer
    timerDiv.addEventListener('click', function() {
        document.body.removeChild(timerDiv);
    });

    return timerDiv;
}

// Initialize and start the countdown
function startCountdown(duration, display) {
    let timer = duration, hours, minutes, seconds;
    const countdown = setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        // Formatting
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + ":" + minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdown);
            display.textContent = 'ChatGPT 4 Ready';
            display.style.backgroundColor = 'green';
            playAlarmSound();
            triggerConfetti();
            
        }
    }, 1000);
}

// Check if a timer should be started on page load
window.addEventListener('load', function() {
    chrome.storage.local.get('endTime', function(data) {
    if (data.endTime) {
    const endTime = new Date(data.endTime);
    const remainingTime = calculateTimeRemaining(endTime);
    if (remainingTime > 0) {
    const floatingTimer = createFloatingTimer();
    startCountdown(remainingTime, floatingTimer);
    } else {
    // Clear end time if it has passed
    chrome.storage.local.remove('endTime');
    }
    }
    });
    });
    
    // Extracts and returns time from elements
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
    
    // MutationObserver to detect changes and add timer
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

//play sound and trigger confetti
function playAlarmSound() {
    var audio = new Audio(chrome.runtime.getURL('assets/rooster-alarm.wav'));
    audio.play();
}
function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}
window.addEventListener('load', initializeMutationObserver);

//here