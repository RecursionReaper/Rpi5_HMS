import io
import time
from fastapi import FastAPI
from starlette.responses import StreamingResponse
from picamera2 import Picamera2

app = FastAPI()

def generate_frames():
    picam2 = Picamera2()
    camera_config = picam2.create_video_configuration(main={"size": (640, 480)})
    picam2.configure(camera_config)
    picam2.start()

    try:
        while True:
            frame = io.BytesIO()
            picam2.capture_file(frame, format="jpeg")
            frame.seek(0)
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + frame.read() + b"\r\n")
            time.sleep(0.05)  # Adjust frame rate if needed
    finally:
        picam2.stop()
        picam2.close()

@app.get("/video")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")
