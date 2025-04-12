import cv2
import time
import yagmail
import threading
import queue
import numpy as np
from picamera2 import Picamera2
from ultralytics import YOLO
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import uvicorn

app = FastAPI()

# Global variables
frame_queue = queue.Queue(maxsize=2)  # Queue to hold frames between threads
result_queue = queue.Queue(maxsize=2)  # Queue to hold processed results
running = True
last_email_time = 0  # Timestamp for cooldown

# Camera setup
picam2 = None
model = None

# Initialize hardware and models
def initialize_system():
    global picam2, model
    
    # Camera setup
    picam2 = Picamera2()
    picam2.preview_configuration.main.size = (640, 480)
    picam2.preview_configuration.main.format = "RGB888"
    picam2.preview_configuration.align()
    picam2.configure("preview")
    picam2.start()
    
    # Load YOLO model
    model = YOLO("yolov8n_ncnn_model")
    print("System initialized")

# Email setup
SENDER_EMAIL = "rasphss@gmail.com"
RECEIVER_EMAIL = "aniketdesai2005@gmail.com"
APP_PASSWORD = "bxqu ydcp sted yihm"

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

def capture_frames():
    """Continuously capture frames from the camera in a separate thread."""
    global running, picam2
    print("Frame capture thread started")
    
    while running:
        try:
            frame = picam2.capture_array()
            
            # If queue is full, remove oldest frame
            if frame_queue.full():
                try:
                    frame_queue.get_nowait()
                except queue.Empty:
                    pass
                    
            # Add new frame to queue
            frame_queue.put(frame, block=False)
            time.sleep(0.01)  # Small delay to prevent CPU overload
            
        except Exception as e:
            print(f"Error capturing frame: {e}")
            time.sleep(0.1)

def process_frames():
    """Process frames with YOLO in a separate thread."""
    global running, model
    print("Frame processing thread started")
    
    while running:
        try:
            # Get a frame from the queue
            if frame_queue.empty():
                time.sleep(0.01)
                continue
                
            frame = frame_queue.get()
            
            # Run YOLO detection
            results = model.predict(frame, imgsz=320, conf=0.5, iou=0.4, max_det=10)
            annotated_frame = results[0].plot()
            
            # Check if a person is detected
            for result in results:
                for box in result.boxes:
                    class_id = int(box.cls[0])
                    if class_id == 0:  # Person detection
                        threading.Thread(target=send_email, daemon=True).start()
            
            # FPS calculation
            inference_time = results[0].speed['inference']
            fps = 1000 / inference_time if inference_time > 0 else 0
            
            cv2.putText(
                annotated_frame, f'FPS: {fps:.1f}',
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2
            )
            
            # If queue is full, remove oldest result
            if result_queue.full():
                try:
                    result_queue.get_nowait()
                except queue.Empty:
                    pass
                    
            # Add processed frame to result queue
            result_queue.put(annotated_frame, block=False)
            
        except Exception as e:
            print(f"Error processing frame: {e}")
            time.sleep(0.1)

def generate_frames():
    """Stream the processed frames."""
    global running
    # Initialize last_frame outside the loop for fallback
    last_frame = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.putText(last_frame, "Starting stream...", (150, 240),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    
    # Start threads if they're not already running
    if not hasattr(generate_frames, "initialized"):
        initialize_system()
        threading.Thread(target=capture_frames, daemon=True).start()
        threading.Thread(target=process_frames, daemon=True).start()
        generate_frames.initialized = True
    
    while True:
        try:
            # Get processed frame from result queue
            if not result_queue.empty():
                frame = result_queue.get()
                last_frame = frame  # Update last_frame with the latest
            else:
                frame = last_frame  # Use the previous frame if no new one
                time.sleep(0.01)
                
            # Encode and yield frame
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                continue
                
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
                
        except Exception as e:
            print(f"Error generating frame: {e}")
            time.sleep(0.1)

@app.get("/")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.on_event("shutdown")
def shutdown_event():
    """Clean up resources when the application shuts down."""
    global running, picam2
    running = False
    time.sleep(0.5)  # Give threads time to exit gracefully
    
    if picam2 is not None:
        picam2.stop()
        picam2.close()
    
    print("Application shutdown, resources released")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
