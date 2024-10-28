/*jshint esversion: 8 */

// Disable page scrolling
document.body.addEventListener('touchstart', (e) => e.preventDefault());

const joystick = document.getElementById('joystick');
const joystick_handle = document.getElementById('joystick_handle');
// const genericTriggerButton = document.getElementById('genericButton');

let isDragging = false;
let lastSentTime = 0;
const sendRateLimit = 250; // milliseconds

function genericTriggerFunction() {
    fetch('/trigger', {
        method: 'POST'
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

// genericTriggerButton.addEventListener('click', genericTriggerFunction);

function sendCoordinates(x, y) {
    // TODO: Or big enough move?
    if (Date.now() - lastSentTime > sendRateLimit) {
        console.info('sendCoordinates: ', x, y);
        fetch('/joystick_endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ x: x, y: y })
        }).then(response => {
            // Any actions
        }).catch(error => {
            console.error('Error sending coordinates:', error);
        });

        lastSentTime = Date.now();
    }
}

joystick.addEventListener('mousedown', (event) => {
    isDragging = true;
});

const centerAndSendHalt = () => {
    isDragging = false;
    joystick_handle.style.left = '50%';
    joystick_handle.style.top = '50%';
    sendCoordinates(0, 0); // Send final 0,0 coordinate
};

joystick.addEventListener('mouseup', () => {
    centerAndSendHalt();
    //setTimeout(centerAndSendHalt, 200);
});

joystick.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const rect = joystick.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        // Clamp x and y values to -1 to 1
        const clampedX = Math.max(-1, Math.min(1, x));
        const clampedY = Math.max(-1, Math.min(1, y));

        joystick_handle.style.left = `${50 + clampedX * 50}%`;
        joystick_handle.style.top = `${50 + clampedY * 50}%`;

        sendCoordinates(clampedX, clampedY);
    }
});

const grabber = document.getElementById('grabber');
grabber.addEventListener("input", (event) => {
    console.log('Grabber input:', event.target.value);
});

grabber.addEventListener("change", (event) => {
    console.log('Grabber change:', event.target.value);
    event.preventDefault();
    grabber.value = 0;
    // Remember to send 0
});
// const slider = document.querySelector('.slider');

// function handleSliderEvent(event) {
//     // Prevent default behavior to avoid page scrolling
//     event.preventDefault();

//     // Get the current position of the slider thumb
//     let position;
//     if (event.type === 'mousedown' || event.type === 'mousemove') {
//         position = event.clientX;
//     } else if (event.type === 'touchstart' || event.type === 'touchmove') {
//         position = event.touches[0].clientX;
//     }

//     // Calculate the new value for the slider based on the position
//     // ... (Your calculation logic here)
//     //slider.value = newValue;
// }


// slider.addEventListener('mousedown', handleSliderEvent);
// slider.addEventListener('touchstart', handleSliderEvent);

// slider.addEventListener('mousemove', handleSliderEvent);
// slider.addEventListener('touchmove', handleSliderEvent);

// slider.addEventListener('mouseup', () => {
//     slider.value = 0; // Snap back to 50%
// });
// slider.addEventListener('touchend', () => {
//     slider.value = 0; // Snap back to 50%
// });