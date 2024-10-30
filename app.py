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
        x = int(data['x']*100)
        BP.set_motor_power(BP.PORT_A, x)
        return f'A:{x}'
    except Exception as e:
        print(f"Error in move_motor: {data}")
        print(e)
        return e

# d is sideways, c is up/down
@app.route('/motor_x_y', methods=['POST'])
def handle_joystick_input():
    try:
        data = request.get_json()
        x = data['x']
        y = data['y']
        print(f"Received coordinates: x={x}, y={y}")
        BP.set_motor_power(BP.PORT_D, int(x*100))
        BP.set_motor_power(BP.PORT_C, int(y*100))
        return 'OK'
    except Exception as e:
        print(f"Error in motor_x_y {data}")
        print(e)
        return e
  
if __name__ == '__main__':
    try: 
        app.run(host='0.0.0.0', debug=True)
        print('Finished app.run')
    except KeyboardInterrupt: # except the program gets interrupted by Ctrl+C on the keyboard.
        BP.reset_all()   # Unconfigure the sensors, disable the motors, and restore the LED to the co

