import RPi.GPIO as GPIO
import time
import json
import traceback

# below this threshold camera brightness value, LED turns on
BRIGHTNESS_THRESHOLD = 0.05

# set up IO to control led
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(18,GPIO.OUT)

def on_message(topic, message):
  '''handle messages to control IO
  '''
  print(topic)
  print(message)
  
  # if topic is camera/brightness then turn the LED on if the brightness is low
  if topic == 'camera/brightness':
    try: 
      message = json.loads(message)
      brightness = message['brightness']
      if brightness < BRIGHTNESS_THRESHOLD:
        print('HIGH')
        GPIO.output(18,GPIO.HIGH)
      else:
        print('LOW')
        GPIO.output(18,GPIO.LOW)
    except Exception as error:
      print(error)
      traceback.print_exc()

