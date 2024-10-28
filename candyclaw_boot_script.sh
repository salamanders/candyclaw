#!/bin/bash

# Option 1: copy this to /etc/rc.local/ then `sudo chmod +x /etc/rc.local``

# Start your Python script in the background and ignore HUP signals
nohup /usr/bin/python3 /home/pi/candyclaw/app.py &

exit 0