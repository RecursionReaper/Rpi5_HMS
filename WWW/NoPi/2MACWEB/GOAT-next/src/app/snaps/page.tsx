"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Snapshot = {
  id: string;
  imageData: string;
  timestamp: string;
};

const SNAPSHOTS_STORAGE_KEY = 'hms-snapshots';

export default function SnapsPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize camera and load snapshots
  useEffect(() => {
    let stream: MediaStream | null = null;

    // Initialize camera for live preview
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

    // Load snapshots from localStorage
    const loadSnapshots = () => {
      // First, load existing snapshots
      const savedSnapshots = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
      const existingSnapshots: Snapshot[] = savedSnapshots ? JSON.parse(savedSnapshots) : [];

      // Then, check for new capture
      const latestImage = localStorage.getItem('capturedImage');
      if (latestImage) {
        const newSnapshot = {
          id: new Date().getTime().toString(),
          imageData: latestImage,
          timestamp: new Date().toLocaleString(),
        };

        // Combine existing snapshots with new one
        const updatedSnapshots = [newSnapshot, ...existingSnapshots];
        setSnapshots(updatedSnapshots);

        // Save to localStorage
        localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updatedSnapshots));

        // Clear the temporary capture
        localStorage.removeItem('capturedImage');
      } else {
        // If no new capture, just set existing snapshots
        setSnapshots(existingSnapshots);
      }
    };

    // Initialize both camera and snapshots
    initCamera();
    loadSnapshots();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const deleteSnapshot = (id: string) => {
    const updatedSnapshots = snapshots.filter(snap => snap.id !== id);
    setSnapshots(updatedSnapshots);
    // Update localStorage when deleting
    localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updatedSnapshots));
    // Close modal if the deleted snapshot was selected
    if (selectedSnapshot?.id === id) {
      setSelectedSnapshot(null);
    }
  };

  const clearAllSnapshots = () => {
    setSnapshots([]);
    localStorage.setItem(SNAPSHOTS_STORAGE_KEY, '[]');
    setSelectedSnapshot(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Camera Snapshots
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          View and manage captured images from your surveillance system
        </p>
      </div>

      {/* STATUS INDICATOR */}
      <div className="flex justify-center mb-4">
        <div className="px-4 py-2 rounded-full bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 inline-flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-zinc-400">
            {cameraReady ? 'Camera Active' : 'Camera Offline'}
          </span>
        </div>
      </div>

      {/* Live Stream Preview */}
      <div className="bg-zinc-900/40 rounded-xl p-6 border border-zinc-800/50 backdrop-blur-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3" />
              <path d="M4 4v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
            </svg>
            Live Preview
            {cameraReady && <span className="ml-2 text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full animate-pulse">LIVE</span>}
          </h2>
        </div>

        <div className="group relative overflow-hidden rounded-lg bg-black/60 border border-zinc-800/70">
          {/* Video frame styling */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Top control bar */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-black/60 flex items-center px-3 z-10">
            <div className="flex space-x-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            </div>
          </div>

          {/* Video element */}
          <div className="aspect-video pt-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
              onLoadedMetadata={() => setCameraReady(true)}
            />
          </div>

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
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white shadow-lg transition-colors"
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

      {/* Snapshots Gallery */}
      <div className="bg-zinc-900/40 rounded-xl p-6 border border-zinc-800/50 backdrop-blur-md shadow-xl mt-8">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-semibold text-white">Captured Snapshots</h2>
            <span className="text-sm px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">
              {snapshots.length} {snapshots.length === 1 ? 'image' : 'images'}
            </span>
          </div>

          {snapshots.length > 0 && (
            <button
              onClick={clearAllSnapshots}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm flex items-center space-x-2 mt-2 sm:mt-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear All</span>
            </button>
          )}
        </div>

        {snapshots.length === 0 ? (
          <div className="bg-zinc-900/60 rounded-lg border border-zinc-800/70 text-center py-16 px-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-zinc-400 text-lg mb-4">No snapshots captured yet</p>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg inline-flex items-center space-x-2 shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <span>Go to Camera</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="bg-zinc-900/60 rounded-lg border border-zinc-800/70 overflow-hidden hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
              >
                <div
                  className="relative aspect-video overflow-hidden bg-black cursor-pointer"
                  onClick={() => setSelectedSnapshot(snapshot)}
                >
                  <img
                    src={snapshot.imageData}
                    alt={`Snapshot from ${snapshot.timestamp}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center">
                    <time className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                      {snapshot.timestamp.split(',')[0]}
                    </time>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSnapshot(snapshot.id);
                      }}
                      className="text-white/80 hover:text-white bg-red-600/20 hover:bg-red-600/40 rounded-full p-1.5 backdrop-blur-sm transition-colors"
                      title="Delete snapshot"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <time className="text-xs text-zinc-500">
                    {snapshot.timestamp.split(',')[1]}
                  </time>
                  <a
                    href={snapshot.imageData}
                    download={`snapshot-${snapshot.timestamp.replace(/[/\\?%*:|"<>]/g, '-')}.jpg`}
                    className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors flex items-center space-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Snapshot modal viewer */}
      {selectedSnapshot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center" onClick={() => setSelectedSnapshot(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-12 right-0 flex space-x-4">
              <a
                href={selectedSnapshot.imageData}
                download={`snapshot-${selectedSnapshot.timestamp.replace(/[/\\?%*:|"<>]/g, '-')}.jpg`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2.5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
              <button
                onClick={() => deleteSnapshot(selectedSnapshot.id)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2.5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="bg-zinc-700 hover:bg-zinc-600 text-white rounded-full p-2.5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
              <div className="aspect-video bg-black">
                <img
                  src={selectedSnapshot.imageData}
                  alt={`Snapshot from ${selectedSnapshot.timestamp}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 border-t border-zinc-800">
                <time className="text-zinc-400">{selectedSnapshot.timestamp}</time>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}