from flask import Flask, request, send_from_directory

import time
import brickpi3

BP = brickpi3.BrickPi3() # Create an instance of the BrickPi3 class. BP will be the BrickPi3 object.

app = Flask(__name__, static_folder='web')

@app.route('/')
def index():
    return send_from_directory('web', 'index.html')

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
  
if __name__ == '__main__':
    try: 
        print('Starting on port 9876')
        app.run(host='0.0.0.0', debug=True, port=9876)
        print('Finished app.run')
    except KeyboardInterrupt: # except the program gets interrupted by Ctrl+C on the keyboard.
        BP.reset_all()   # Unconfigure the sensors, disable the motors, and restore the LED to the co
