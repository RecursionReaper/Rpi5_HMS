"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // Initialize camera when component mounts
  useEffect(() => {
    let stream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        // Request access to the webcam
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user" // Use front camera for MacBook
          },
          audio: false
        });

        // Connect the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setStreamError("Failed to access MacBook camera. Please check camera permissions.");
      }
    };

    initCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = async () => {
    setIsCapturing(true);
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video) {
        // Set canvas dimensions to match the video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame onto the canvas
        const context = canvas.getContext("2d");
        if (!context) return;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64 and save
        const imageData = canvas.toDataURL("image/jpeg", 0.95);
        localStorage.setItem("capturedImage", imageData);

        // Navigate to snapshots page
        window.location.href = "/snaps";
      }
    } catch (error) {
      console.error("Failed to capture image:", error);
      alert("Failed to capture image. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Home Monitoring System
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          AI-powered surveillance system for intelligent home monitoring and security
        </p>
      </div>

      {/* LIVE STREAM SECTION */}
      <main className="flex flex-col justify-center items-center flex-1 p-4 sm:p-6 md:p-8 relative z-10 overflow-hidden space-y-4">
        <div className="bg-gradient-to-br from-zinc-950/90 to-black/90 w-full sm:w-[90%] md:w-[80%] lg:w-[75%] shadow-2xl rounded-xl sm:rounded-2xl flex justify-center items-center border border-zinc-800/30 backdrop-blur-lg overflow-hidden relative">
          {/* Video element for live webcam stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
            onLoadedMetadata={() => setCameraReady(true)}
          />
          <canvas ref={canvasRef} className="hidden" />

          {streamError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-red-400 text-center p-4">
                <p>{streamError}</p>
                <button
                  onClick={() => {
                    setStreamError(null);
                    setCameraReady(false);
                    // Attempt to reinitialize camera
                    navigator.mediaDevices.getUserMedia({
                      video: true,
                      audio: false
                    }).then(stream => {
                      if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setCameraReady(true);
                      }
                    }).catch(err => {
                      setStreamError("Failed to access MacBook camera. Please check camera permissions.");
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                >
                  Retry Camera Access
                </button>
              </div>
            </div>
          )}

          {!cameraReady && !streamError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-blue-400 text-center">
                <svg className="animate-spin h-10 w-10 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Initializing camera...</p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={captureImage}
          disabled={isCapturing || !cameraReady}
          className={`px-6 py-3 ${isCapturing || !cameraReady ? 'bg-blue-800 opacity-70' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } text-white rounded-lg transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-blue-500/20`}
        >
          <svg
            className={`w-6 h-6 ${isCapturing ? 'animate-pulse' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-7 13a4 4 0 110-8 4 4 0 010 8z" />
          </svg>
          <span className="text-lg">{isCapturing ? 'Capturing...' : 'Capture Snapshot'}</span>
        </button>
      </main>
    </div>
  );
}