"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureImage = async () => {
    setIsCapturing(true);
    try {
      const canvas = canvasRef.current;
      const video = document.getElementById("live-stream") as HTMLImageElement;

      if (canvas && video) {
        // Create a temporary image to capture the current frame
        const img = new Image();
        img.crossOrigin = "anonymous";

        // Create a promise to handle image loading
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          // Force a new request to get the latest frame
          img.src = "/py?" + new Date().getTime();
        });

        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        const context = canvas.getContext("2d");
        if (!context) return;

        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to base64 and save
        const imageData = canvas.toDataURL("image/jpeg", 0.95);
        localStorage.setItem("capturedImage", imageData);

        // Force navigation to snapshots page
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
          <img
            id="live-stream"
            src="/py"
            alt="Live Stream"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Stream error:', e);
              setStreamError('Failed to load camera stream. Please check if the camera server is running.');
            }}
          />
          <canvas ref={canvasRef} className="hidden" />
          {streamError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-red-400 text-center p-4">
                <p>{streamError}</p>
                <button
                  onClick={() => {
                    setStreamError(null);
                    const img = document.getElementById('live-stream') as HTMLImageElement;
                    if (img) img.src = '/py?' + new Date().getTime();
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={captureImage}
          disabled={isCapturing}
          className={`px-6 py-3 ${isCapturing ? 'bg-blue-800' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
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
