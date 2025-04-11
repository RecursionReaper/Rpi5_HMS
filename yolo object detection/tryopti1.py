import io
import time
import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from picamera2 import Picamera2

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Improved Camera Singleton with frame buffer
class Camera:
    _instance = None
    _lock = threading.Lock()
    _latest_frame = None
    _running = False
    _thread = None

    @staticmethod
    def get_instance():
        with Camera._lock:
            if Camera._instance is None:
                Camera._instance = Picamera2()
                config = Camera._instance.create_video_configuration(
                    main={"size": (640, 480)},
                    buffer_count=4  # Increase buffer count for smoother streaming
                )
                Camera._instance.configure(config)
                Camera._instance.start()
                Camera._running = True
                # Start background capture thread
                Camera._thread = threading.Thread(target=Camera._background_capture, daemon=True)
                Camera._thread.start()
            return Camera._instance

    @staticmethod
    def _background_capture():
        """Continuously captures frames in the background to prevent lag"""
        while Camera._running:
            try:
                frame = io.BytesIO()
                Camera._instance.capture_file(frame, format="jpeg")
                frame.seek(0)
                
                # Update the latest frame with lock to prevent race conditions
                with Camera._lock:
                    Camera._latest_frame = frame.getvalue()
                
                # Capture at ~30fps (adjust as needed for your hardware)
                time.sleep(0.033)
            except Exception as e:
                print(f"Background capture error: {e}")
                time.sleep(0.1)  # Brief pause before retry on error

    @staticmethod
    def get_frame():
        """Returns the latest captured frame"""
        with Camera._lock:
            if Camera._latest_frame is None:
                # Return an empty frame if none available yet
                dummy = io.BytesIO()
                dummy.write(b'')
                dummy.seek(0)
                return dummy.getvalue()
            return Camera._latest_frame

    @staticmethod
    def release():
        """Properly release camera resources"""
        with Camera._lock:
            if Camera._instance is not None:
                Camera._running = False
                if Camera._thread:
                    Camera._thread.join(timeout=1.0)
                Camera._instance.stop()
                Camera._instance.close()
                Camera._instance = None
                Camera._latest_frame = None

# Frame generator that uses the pre-captured frames
def generate_frames():
    # Initialize the camera instance
    Camera.get_instance()
    
    try:
        while True:
            frame_data = Camera.get_frame()
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + frame_data + b"\r\n")
            # Short sleep to control output rate
            time.sleep(0.01)
    except Exception as e:
        print(f"Error in streaming: {e}")
        
# Video Streaming Route (unchanged)
@app.get("/")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

# Cleanup on shutdown
@app.on_event("shutdown")
def shutdown_event():
    Camera.release()

# Run FastAPI Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, workers=1)
