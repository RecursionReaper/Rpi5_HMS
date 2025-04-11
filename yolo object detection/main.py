import io
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from picamera2 import Picamera2

app = FastAPI()

# ✅ Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to specific domain for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Singleton Camera Instance
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

# ✅ Frame Generator Function
def generate_frames():
    picam2 = Camera.get_instance()
    
    try:
        while True:
            frame = io.BytesIO()
            picam2.capture_file(frame, format="jpeg")
            frame.seek(0)
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + frame.read() + b"\r\n")
            time.sleep(0.05)  # Adjust frame rate if needed
    except Exception as e:
        print(f"Error in streaming: {e}")
    finally:
        picam2.stop()
        picam2.close()

# ✅ Video Streaming Route
@app.get("/")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

# ✅ Run FastAPI Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, workers=1)

