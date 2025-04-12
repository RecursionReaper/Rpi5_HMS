"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const refreshStream = () => {
    const img = document.getElementById('live-stream') as HTMLImageElement;
    if (img) {
      img.src = `/py?${new Date().getTime()}`;
      setLastRefresh(new Date());
    }
  };

  useEffect(() => {
    const refreshInterval = setInterval(refreshStream, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const captureImage = async () => {
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
        context?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg", 0.95);
        localStorage.setItem("capturedImage", imageData);

        router.push("/snaps");
      }
    } catch (error) {
      console.error("Capture error:", error);
      setStreamError("Failed to capture image. Please check camera connection.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shine">
            HMS - Home Surveillance System
          </h1>
          <p className="text-zinc-300 text-lg font-light max-w-3xl mx-auto">
            AI-powered security monitoring with real-time threat detection
          </p>
        </div>

        <main className="relative group">
          {/* Stream Container with Fixed Aspect Ratio */}
          <div className="relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/90 rounded-3xl shadow-2xl border border-zinc-700/30 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-purple-400/30">
            <div className="aspect-video w-full relative">
              <img
                id="live-stream"
                src="/py"
                alt="Live Surveillance Feed"
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{ opacity: streamReady ? 1 : 0 }}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth > 0) setStreamReady(true);
                }}
                onError={() => {
                  setStreamError('Camera connection failed. Please check the server.');
                  setStreamReady(false);
                }}
              />
              
              {/* Loading Overlay */}
              {!streamReady && !streamError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm space-y-4">
                  <div className="animate-spin-fast">
                    <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-zinc-300 font-medium">Initializing camera feed...</p>
                </div>
              )}

              {/* Error Overlay */}
              {streamError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 p-6 text-center space-y-4">
                  <div className="text-red-400">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <p className="text-zinc-100 text-lg font-medium max-w-md">{streamError}</p>
                  <button
                    onClick={refreshStream}
                    className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Retry Connection</span>
                  </button>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />

            {/* Stream Status Overlay */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-zinc-900/80 px-3 py-1.5 rounded-lg">
              <span className={`h-2.5 w-2.5 rounded-full ${streamReady ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-zinc-300 text-sm font-medium">
                {streamReady ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>

            {/* Last Refresh Time */}
            <div className="absolute top-4 right-4 bg-zinc-900/80 px-3 py-1.5 rounded-lg text-zinc-300 text-sm">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>

          {/* Control Panel */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={captureImage}
              disabled={isCapturing || !streamReady}
              className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 rounded-xl transition-all duration-300 group/button overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-20 transition-opacity duration-300" />
              <div className="flex items-center justify-center space-x-3">
                <svg
                  className={`w-6 h-6 ${isCapturing ? 'animate-pulse' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg font-medium text-white">
                  {isCapturing ? 'Capturing...' : 'Capture Snapshot'}
                </span>
              </div>
            </button>

            <button
              onClick={refreshStream}
              disabled={!streamReady}
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-200 rounded-xl transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Stream</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
