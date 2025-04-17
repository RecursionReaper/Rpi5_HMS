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
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Home Monitoring System
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          AI-powered surveillance system for intelligent home monitoring and security
        </p>
      </div>

      {/* STATUS INDICATOR */}
      <div className="flex justify-center mb-2">
        <div className="px-4 py-2 rounded-full bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 inline-flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-zinc-400">
            {cameraReady ? 'Live Camera Feed' : 'Camera Offline'}
          </span>
        </div>
      </div>

      {/* LIVE STREAM SECTION */}
      <div className="flex flex-col justify-center items-center relative z-10 overflow-hidden space-y-6">
        {/* Video Container with style enhancements */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-indigo-500/60 rounded-tl-lg"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-pink-500/60 rounded-br-lg"></div>

          <div className="group bg-gradient-to-br from-zinc-950/90 to-black/90 w-full shadow-2xl rounded-2xl flex justify-center items-center border border-zinc-800/50 backdrop-blur-lg overflow-hidden relative">
            {/* Video frame effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Top control bar simulation */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-black/60 backdrop-blur-sm flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center text-xs text-zinc-500">HMS Camera Feed</div>
            </div>

            {/* Video element for live webcam stream */}
            <div className="pt-8 w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
                onLoadedMetadata={() => setCameraReady(true)}
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />

            {streamError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="text-red-400 text-center p-6 max-w-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-lg mb-4">{streamError}</p>
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
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white shadow-lg transition-all duration-300"
                  >
                    Retry Camera Access
                  </button>
                </div>
              </div>
            )}

            {!cameraReady && !streamError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-indigo-400 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-l-indigo-500 border-t-indigo-500 border-r-transparent border-b-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-lg text-white">Initializing camera...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Capture Button with enhanced styling */}
        <div className="flex justify-center mt-8">
          <button
            onClick={captureImage}
            disabled={isCapturing || !cameraReady}
            className={`relative px-8 py-4 rounded-lg text-white font-medium shadow-xl transition-all duration-500 overflow-hidden ${isCapturing || !cameraReady
              ? 'bg-zinc-800 cursor-not-allowed opacity-70'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/30'
              }`}
          >
            {/* Animated background effect on hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 hover:opacity-20 transition-opacity"></span>

            <div className="relative flex items-center space-x-3">
              <span className={`w-10 h-10 rounded-full flex items-center justify-center ${isCapturing ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </span>
              <span className="text-lg font-semibold">{isCapturing ? 'Capturing...' : 'Capture Snapshot'}</span>
            </div>

            {/* Pulse effect during capturing */}
            {isCapturing && (
              <span className="absolute inset-0 rounded-lg animate-ping bg-indigo-400 opacity-20"></span>
            )}
          </button>
        </div>

        {/* Additional information */}
        <div className="text-center text-zinc-500 text-sm max-w-md mx-auto mt-6">
          Captured images are stored locally and will appear in your Snapshots gallery
        </div>
      </div>
    </div>
  );
}