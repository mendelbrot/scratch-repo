#messages
import awsiot.greengrasscoreipc
from awsiot.greengrasscoreipc.model import (
  PublishToTopicRequest,
  PublishMessage,
  BinaryMessage
)
import json

# camera
import picamera
import picamera.array
import numpy as np
import time

# messages
TIMEOUT = 10

# camera
RESOLUTION = (64, 64)
FRAME_RATE = 4
CAMERA_BRIGHTNESS_TOPIC = 'camera/brightness'

ipc_client = awsiot.greengrasscoreipc.connect()

def publish_message(topic, message):
  '''Sends a mmessage through IPC
  '''
  print(topic)
  print(message)

  request = PublishToTopicRequest()
  request.topic = topic
  publish_message = PublishMessage()
  publish_message.binary_message = BinaryMessage()
  publish_message.binary_message.message = bytes(message, "utf-8")
  request.publish_message = publish_message
  operation = ipc_client.new_publish_to_topic()
  operation.activate(request)
  future = operation.get_response()
  print(future.result(TIMEOUT).__dict__)

def run_camera_loop():
  ''' continue publishing camera data

  for each frame, take the average brightness,
  publish to the camera/brightness topic
  '''

  # initialize the camera and grab a reference to the raw camera capture
  with picamera.PiCamera() as camera:
    with picamera.array.PiRGBArray(camera) as output:
      camera.framerate = FRAME_RATE
      camera.resolution = RESOLUTION

      # allow the camera to warmup
      time.sleep(0.1)

      # capture frames from the camera
      for frame in camera.capture_continuous(output, format="bgr", use_video_port=True):

        # get the average brightness
        print(output.array[30][30])
        rgb = np.mean(output.array, axis=(0, 1))
        brightness = np.mean(rgb)
        rgb = rgb.tolist() # convert from numpy array to list

        # publish
        message = {'brightness': brightness, 'rgb': rgb, 'time': time.time()}
        message = json.dumps(message)
        publish_message(CAMERA_BRIGHTNESS_TOPIC, message)
        
        # the docs don't really explain what this does
        # I think this resizes the "file" to zero bytes
        output.truncate(0)

run_camera_loop()