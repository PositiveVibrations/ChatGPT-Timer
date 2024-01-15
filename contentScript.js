function playSound() {
    const audio = new Audio('data:audio/wav;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==');
    audio.play();
}

function checkTimeAndPlaySound(targetTime) {
    const currentTime = new Date();
    if (currentTime >= targetTime) {
        playSound();
    }
}

function extractTime() {
    const elements = document.querySelectorAll('.flex.items-center.gap-6');
    const extractedTimes = [];

    elements.forEach((element) => {
        const elementText = element.textContent;
        const timeRegex = /(\d{1,2}:\d{2} [APap][Mm])/;
        const timeMatch = elementText.match(timeRegex);
        if (timeMatch) {
            extractedTimes.push(timeMatch[0]);
        }
    });

    return extractedTimes.length > 0 ? extractedTimes[0] : null;
}

function setAndTrackTimer(extractedTime) {
    if (extractedTime) {
        const targetTime = new Date();
        const [hours, minutes] = extractedTime.split(' ')[0].split(':');
        const ampm = extractedTime.split(' ')[1].toLowerCase();

        if (ampm === 'am' || ampm === 'a.m.') {
            targetTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
            targetTime.setHours(parseInt(hours) + 12, parseInt(minutes), 0, 0);
        }

        const timeDifference = targetTime - new Date();

        if (timeDifference <= 0) {
            console.log('It is already past the target time.');
            playSound();
        } else {
            console.log('Setting a timer to play the sound at the target time.');
            setTimeout(() => {
                checkTimeAndPlaySound(targetTime);
            }, timeDifference);
        }

        chrome.runtime.sendMessage({action: "updateTimer", time: targetTime.toString()});
    } else {
        console.log('No time found in the elements.');
    }
}

function injectClickableIcon() {
    const elements = document.querySelectorAll('.flex.items-center.gap-6');
    if (elements.length > 0) {
        const clickableIcon = document.createElement('span');
        clickableIcon.textContent = '⏰';
        clickableIcon.style.cursor = 'pointer';
        clickableIcon.style.marginLeft = '10px';

        elements[0].appendChild(clickableIcon);

        clickableIcon.addEventListener('click', function() {
            const extractedTime = extractTime();
            setAndTrackTimer(extractedTime);
        }
        );
    }
}
