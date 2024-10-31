/*jshint esversion: 8 */

const joystick = document.getElementById('joystick');
const joystick_handle = document.getElementById('joystick_handle');

let isDragging = false;
let lastSentTime = 0;
const sendRateLimit = 250; // milliseconds

function sendCoordinates(x, y) {
    // TODO: Or big enough move?
    if (Date.now() - lastSentTime > sendRateLimit) {
        console.info('sendCoordinates: ', x, y);
        fetch('/motor_x_y', {
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

joystick.addEventListener('touchstart', (event) => {
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
});

joystick.addEventListener('touchend', () => {
    centerAndSendHalt();
});

const handleClientXY = (event) => {
    const rect = joystick.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // Clamp x and y values to -1 to 1
    const clampedX = Math.max(-1, Math.min(1, x));
    const clampedY = Math.max(-1, Math.min(1, y));
    joystick_handle.style.left = `${50 + clampedX * 50}%`;
    joystick_handle.style.top = `${50 + clampedY * 50}%`;

    sendCoordinates(clampedX, clampedY);
};

joystick.addEventListener('mousemove', (event) => {
    if (isDragging) {
        handleClientXY(event)
    }
});

joystick.addEventListener('touchmove', (event) => {
    if (isDragging) {
        const touch = event.touches[0]; // Get the first touch point
        handleClientXY(touch);
    }
});

const motorA = document.getElementById('motorA');

function sendMotorA(x) {
    console.info('sendMotorA: ', x);
    fetch('/motor_a', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ x: x })
    }).then(response => {
        // Any actions
    }).catch(error => {
        console.error('Error sendMotorA to /motor_a:', error);
    });
}

motorA.addEventListener('input', (event) => {
    console.log('motorA input:', event.target.value);
    sendMotorA(event.target.value);
});

motorA.addEventListener('change', (event) => {
    console.log('motorA change:', event.target.value);
    event.preventDefault();
    motorA.value = 0;
    sendMotorA(motorA.value);
});