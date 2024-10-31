from flask import Flask, request, send_from_directory

import time
import brickpi3
import socket

def get_local_ip():
  """Gets the IP address of the machine on the local network.

  Returns:
    str: The IP address (e.g., '192.168.1.100') or None if not found.
  """
  try:
    # Create a socket object
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # Connect to a non-routable IP address (this is a trick to get the local IP)
    s.connect(("8.8.8.8", 80))
    # Get the local IP address from the socket
    ip_address = s.getsockname()[0]
    s.close()
    return ip_address
  except OSError:
    return None
  
BP = brickpi3.BrickPi3() # Create an instance of the BrickPi3 class. BP will be the BrickPi3 object.

app = Flask(__name__, static_folder='./')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/motor_a', methods=['POST'])
def motor_a():
    try: 
        data = request.get_json()
        x = int(float(data['x'])*100)
        BP.set_motor_power(BP.PORT_A, x)
        return "A:{}".format(x)
    except Exception as e:
        print("Error in move_motor: {}".format(request.get_json()))
        print(e)
        return e

# d is sideways, c is up/down
@app.route('/motor_x_y', methods=['POST'])
def handle_joystick_input():
    try:
        data = request.get_json()
        x = float(data['x'])
        y = float(data['y'])
        print("Received coordinates: x={}, y={}".format(x, y))
        BP.set_motor_power(BP.PORT_D, int(x*100))
        BP.set_motor_power(BP.PORT_C, int(y*100))
        return 'OK'
    except Exception as e:
        print("Error in motor_x_y {}".format(request.get_json()))
        print(e)
        return e

@app.after_request
def add_header(response):
    if 'Cache-Control' not in response.headers:
        response.headers['Cache-Control'] = 'no-store'
    return response

if __name__ == '__main__':
    try: 
        local_ip = get_local_ip()
        print('Starting on http://{}:9876'.format(local_ip))
        app.run(host='0.0.0.0', debug=True, port=9876)
        print('Finished app.run')
    except KeyboardInterrupt: # except the program gets interrupted by Ctrl+C on the keyboard.
        BP.reset_all()   # Unconfigure the sensors, disable the motors, and restore the LED to the co

