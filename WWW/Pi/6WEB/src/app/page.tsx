"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamStatus, setStreamStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Function to refresh the stream
  const refreshStream = () => {
    setStreamStatus('loading');
    setErrorMessage(null);
    const img = document.getElementById('live-stream') as HTMLImageElement;
    if (img) {
      img.src = `/py?t=${new Date().getTime()}`;
      setLastRefreshed(new Date());
    }
  };

  // Initial stream setup and periodic refresh
  useEffect(() => {
    const refreshInterval = setInterval(refreshStream, 30000); // Refresh every 30 seconds

    // Add keyboard shortcut for capturing (Space bar)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && streamStatus === 'ready' && !isCapturing) {
        captureImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [streamStatus, isCapturing]);

  const captureImage = async () => {
    if (streamStatus !== 'ready' || isCapturing) return;

    setIsCapturing(true);
    try {
      const canvas = canvasRef.current;
      const video = document.getElementById("live-stream") as HTMLImageElement;

      if (canvas && video) {
        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = "/py?" + new Date().getTime();
        });

        canvas.width = img.width;
        canvas.height = img.height;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Failed to get canvas context");

        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        const timestamp = new Date().toISOString();
        const imageData = canvas.toDataURL("image/jpeg", 0.95);

        // Save image with timestamp metadata
        localStorage.setItem("capturedImage", imageData);
        localStorage.setItem("captureTimestamp", timestamp);

        // Add success feedback animation before redirect
        const feedbackEl = document.getElementById('capture-feedback');
        if (feedbackEl) {
          feedbackEl.classList.remove('opacity-0');
          feedbackEl.classList.add('opacity-100');

          setTimeout(() => {
            window.location.href = "/snaps";
          }, 500);
        } else {
          window.location.href = "/snaps";
        }
      }
    } catch (error) {
      console.error("Failed to capture image:", error);
      setErrorMessage("Failed to capture image. Please try again.");
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsCapturing(false);
    }
  };

  // Format time since last refresh
  const getTimeSinceRefresh = () => {
    const seconds = Math.floor((new Date().getTime() - lastRefreshed.getTime()) / 1000);
    return seconds < 60 ? `${seconds}s ago` : `${Math.floor(seconds / 60)}m ${seconds % 60}s ago`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
          Home Monitoring System
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          AI-powered surveillance system for intelligent home monitoring and security
        </p>
      </div>

      {/* Live stream container with status overlay */}
      <main className="flex flex-col justify-center items-center flex-1 relative z-10 space-y-6">
        <div className="glass-card w-full max-w-5xl mx-auto">
          {/* Status bar */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 bg-black/40">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${streamStatus === 'ready' ? 'bg-green-500 animate-pulse' :
                streamStatus === 'loading' ? 'bg-amber-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
              <span className="text-sm font-medium">
                {streamStatus === 'ready' ? 'Live' :
                  streamStatus === 'loading' ? 'Connecting...' :
                    'Disconnected'}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Last refreshed: {getTimeSinceRefresh()}
            </div>
          </div>

          {/* Stream container */}
          <div className="relative aspect-video w-full bg-black/80 flex justify-center items-center overflow-hidden">
            <img
              id="live-stream"
              src={`/py?t=${new Date().getTime()}`}
              alt="Live Stream"
              className="w-full h-full object-contain"
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                  setStreamStatus('ready');
                }
              }}
              onError={(e) => {
                console.error('Stream error:', e);
                setStreamStatus('error');
                setErrorMessage('Failed to load camera stream. Please check if the Raspberry Pi camera server is running.');
              }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Error overlay */}
            {streamStatus === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="text-center p-6 max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-red-400 mb-2">Connection Error</h3>
                  <p className="text-gray-300 mb-4">{errorMessage}</p>
                  <button
                    onClick={refreshStream}
                    className="btn-secondary"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {streamStatus === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <svg className="animate-spin h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-indigo-300 font-medium">Connecting to camera stream...</p>
                </div>
              </div>
            )}

            {/* Capture success feedback */}
            <div id="capture-feedback" className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm opacity-0 transition-opacity duration-300">
              <div className="bg-black/60 p-6 rounded-xl border border-green-500/30">
                <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-center mt-2 text-green-400 font-medium">Snapshot captured!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls section */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-xl mx-auto">
          <button
            onClick={captureImage}
            disabled={streamStatus !== 'ready' || isCapturing}
            className={`btn flex-1 flex items-center justify-center space-x-3 ${streamStatus !== 'ready' || isCapturing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
          >
            <svg
              className={`w-5 h-5 ${isCapturing ? 'animate-pulse' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-7 13a4 4 0 110-8 4 4 0 010 8z" />
            </svg>
            <span>{isCapturing ? 'Capturing...' : 'Capture Snapshot'}</span>
          </button>

          <button
            onClick={refreshStream}
            disabled={isCapturing}
            className={`btn-secondary flex-1 flex items-center justify-center space-x-2 ${isCapturing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Stream</span>
          </button>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="text-center text-gray-400 text-sm">
          <p>Press <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-xs">Space</kbd> to capture snapshot</p>
        </div>
      </main>
    </div>
  );
}