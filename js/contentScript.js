var clockEmojiAdded = false; //

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
            startConfetti();
           
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

// Confetti Particle Class
class ConfettiParticle {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;
        this.lightness = 50;
        this.diameter = Math.random() * 10 + 5;
        this.tilt = Math.random() * 10 - 10;
        this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
        this.tiltAngle = 0;

        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.verticalSpeed = Math.random() * 3 + 3;
        this.horizontalSpeed = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.wobble();
        this.y += this.verticalSpeed;
        this.tiltAngle += this.tiltAngleIncremental;
        this.x += this.horizontalSpeed;

        if (this.isOutOfBound()) {
            this.reset();
        }
    }

    wobble() {
        this.tilt = Math.sin(this.tiltAngle) * 12;
    }

    isOutOfBound() {
        return (this.y > this.height + 20 || this.x < -20 || this.x > this.width + 20);
    }

    reset() {
        this.x = Math.random() * this.width;
        this.y = Math.random() * this.height - this.height;
        this.tilt = Math.random() * 10 - 10;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.diameter;
        this.ctx.strokeStyle = this.color;
        this.ctx.moveTo(this.x + this.tilt + this.diameter / 2, this.y);
        this.ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.diameter / 2);
        this.ctx.stroke();
    }
}

function startConfetti() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 9999;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 150 }).map(() => new ConfettiParticle(ctx, width, height));

    let animationId = null;

    function update() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(update);
    }

    function stopConfetti() {
        cancelAnimationFrame(animationId);
        canvas.remove();

        // Remove the event listener after stopping confetti
        document.removeEventListener('click', stopConfetti);
    }

    update();

    // Add click event listener to stop the confetti
    document.addEventListener('click', stopConfetti);
}

window.addEventListener('load', initializeMutationObserver);

//here