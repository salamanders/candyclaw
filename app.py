from flask import Flask, request, send_from_directory

app = Flask(__name__, static_folder='web')

@app.route('/')
def index():
    return send_from_directory('web', 'index.html')

# def my_function():
#     # Your function logic here
#     print("Function triggered!")

# @app.route('/trigger', methods=['POST'])
# def trigger_function():
#     my_function()
#     return 'Function triggered!'

@app.route('/move_motor', methods=['POST'])
def move_motor():
    speed = request.form['speed']
    move_motor(int(speed))
    return 'Motor moved!'

@app.route('/joystick_endpoint', methods=['POST'])
def handle_joystick_input():
  data = request.get_json()
  x = data['x']
  y = data['y']
  print("Received coordinates: x=%s, y=%s" % (x, y))
  # ... your control logic here ...
  return 'OK'

if __name__ == '__main__':
    app.run(host='0.0.0.0', ssl_context='adhoc', debug=True)