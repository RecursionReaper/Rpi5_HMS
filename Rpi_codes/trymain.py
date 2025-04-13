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
    allow_origins=["*"],  # Change "*" to specific domain for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Improved Camera Singleton with background capture
class Camera:
    _instance = None
    _lock = threading.Lock()
    _latest_frame = None
    _running = False
    _capture_thread = None
    
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
                
                # Start background capture
                Camera._running = True
                Camera._capture_thread = threading.Thread(
                    target=Camera._capture_background, 
                    daemon=True
                )
                Camera._capture_thread.start()
            return Camera._instance
    
    @staticmethod
    def _capture_background():
        """Continuously capture frames in background thread"""
        while Camera._running:
            try:
                # Create new BytesIO object for the frame
                frame_buffer = io.BytesIO()
                Camera._instance.capture_file(frame_buffer, format="jpeg")
                frame_buffer.seek(0)
                
                # Update the latest frame
                with Camera._lock:
                    Camera._latest_frame = frame_buffer.getvalue()
                
                # Sleep to control frame rate
                time.sleep(0.033)  # ~30fps
            except Exception as e:
                print(f"Background capture error: {e}")
                time.sleep(0.1)  # Short delay on error
    
    @staticmethod
    def get_frame():
        """Get the latest captured frame"""
        with Camera._lock:
            return Camera._latest_frame
    
    @staticmethod
    def release():
        """Release camera resources"""
        with Camera._lock:
            if Camera._instance is not None:
                Camera._running = False
                if Camera._capture_thread:
                    Camera._capture_thread.join(timeout=1.0)
                Camera._instance.stop()
                Camera._instance.close()
                Camera._instance = None
                Camera._latest_frame = None

# Frame Generator Function
def generate_frames():
    # Initialize camera
    Camera.get_instance()
    
    # Wait briefly for first frame
    time.sleep(0.1)
    
    try:
        while True:
            # Get the latest frame
            frame_data = Camera.get_frame()
            
            if frame_data:
                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" + frame_data + b"\r\n")
            
            # Control output rate
            time.sleep(0.033)
    except Exception as e:
        print(f"Error in streaming: {e}")

# Video Streaming Route
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
