import cv2
from picamera2 import Picamera2
from ultralytics import YOLO
from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
import uvicorn
import io

app = FastAPI()

# Set up the camera with Picamera2
picam2 = Picamera2()
picam2.preview_configuration.main.size = (1280, 1280)
picam2.preview_configuration.main.format = "RGB888"
picam2.preview_configuration.align()
picam2.configure("preview")
picam2.start()

# Load YOLOv8 model
model = YOLO("yolov8n_ncnn_model")

def generate_frames():
    while True:
        # Capture a frame from the camera
        frame = picam2.capture_array()

        # Run YOLO model on the captured frame and store the results
        results = model.predict(frame, imgsz=320)
        annotated_frame = results[0].plot()

        # Get inference time and calculate FPS
        inference_time = results[0].speed['inference']
        fps = 1000 / inference_time
        text = f'FPS: {fps:.1f}'

        # Draw FPS on the frame
        font = cv2.FONT_HERSHEY_SIMPLEX
        text_size = cv2.getTextSize(text, font, 1, 2)[0]
        text_x = annotated_frame.shape[1] - text_size[0] - 10
        text_y = text_size[1] + 10
        cv2.putText(annotated_frame, text, (text_x, text_y), font, 1, (255, 255, 255), 2, cv2.LINE_AA)

        # Encode frame as JPEG
        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        if not ret:
            continue

        # Yield frame in byte format for streaming
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.get("/")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
