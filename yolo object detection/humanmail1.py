import cv2
import time
import yagmail
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

# Load YOLO model (Ensure NCNN model is available)
model = YOLO("yolov8n_ncnn_model")

# Email setup
SENDER_EMAIL = "rasphss@gmail.com"
RECEIVER_EMAIL = "aniketdesai2005@gmail.com"
APP_PASSWORD = "bxqu ydcp sted yihm"  # Replace 'xyz' with your actual app password

last_email_time = 0  # Timestamp for cooldown


def send_email():
    """Send an email notification when a human is detected."""
    global last_email_time

    current_time = time.time()
    if current_time - last_email_time < 120:  # 2-minute cooldown
        return

    try:
        yag = yagmail.SMTP(SENDER_EMAIL, APP_PASSWORD)
        yag.send(
            to=RECEIVER_EMAIL,
            subject="Alert: Human Detected!",
            contents="Hi Master Aniket, a human has been detected by the surveillance system.",
        )
        last_email_time = current_time
        print("Email sent successfully!")

    except Exception as e:
        print(f"Failed to send email: {e}")


def generate_frames():
    """Capture frames, perform detection, and stream the annotated video."""
    while True:
        frame = picam2.capture_array()

        # Run YOLO detection
        results = model.predict(frame, imgsz=320, conf=0.5, iou=0.4, max_det=10)
        annotated_frame = results[0].plot()

        # Check if a person is detected
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])  # Get class ID
                if class_id == 0:  # YOLO class '0' corresponds to 'person'
                    send_email()  # Send email alert

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
