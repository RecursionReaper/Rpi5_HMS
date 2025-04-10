import cv2
from picamera2 import Picamera2
from ultralytics import YOLO
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import uvicorn

app = FastAPI()

# Camera setup
picam2 = Picamera2()
picam2.preview_configuration.main.size = (640, 480)  # Lower resolution for speed
picam2.preview_configuration.main.format = "RGB888"
picam2.preview_configuration.align()
picam2.configure("preview")
picam2.start()

# Load YOLO model
model = YOLO("yolov8n.pt")  # Make sure you have this model file in your directory

def generate_frames():
    while True:
        frame = picam2.capture_array()

        # Run detection with optimized settings
        results = model.predict(frame, imgsz=320, conf=0.5, iou=0.4, max_det=10)
        annotated_frame = results[0].plot()

        # FPS calculation
        inference_time = results[0].speed['inference']
        fps = 1000 / inference_time
        cv2.putText(
            annotated_frame, f'FPS: {fps:.1f}',
            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2
        )

        # Encode and yield frame
        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        if not ret:
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')


@app.get("/")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
