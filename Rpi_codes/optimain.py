import io
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from picamera2 import Picamera2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Camera:
    _instance = None
    
    @staticmethod
    def get_instance():
        if Camera._instance is None:
            Camera._instance = Picamera2()
            config = Camera._instance.create_video_configuration(main={"size": (640, 480)})
            Camera._instance.configure(config)
            Camera._instance.start()
        return Camera._instance
    
    @staticmethod
    def release_instance():
        if Camera._instance is not None:
            Camera._instance.stop()
            Camera._instance.close()
            Camera._instance = None

def generate_frames():
    picam2 = Camera.get_instance()
    frame = io.BytesIO()
    
    try:
        while True:
            # Clear the BytesIO object instead of creating a new one
            frame.seek(0)
            frame.truncate(0)
            
            # Capture frame
            picam2.capture_file(frame, format="jpeg")
            frame.seek(0)
            
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + frame.read() + b"\r\n")
            
            # Slightly longer sleep to give the camera time to process
            time.sleep(0.1)
    except Exception as e:
        print(f"Error in streaming: {e}")
        Camera.release_instance()

@app.get("/")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

# Cleanup handler for application shutdown
@app.on_event("shutdown")
def shutdown_event():
    Camera.release_instance()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, workers=1)
