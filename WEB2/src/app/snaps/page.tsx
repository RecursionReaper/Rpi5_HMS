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
  const [streamReady, setStreamReady] = useState(false);

  // Refresh the stream
  const refreshStream = () => {
    const img = document.getElementById('live-stream') as HTMLImageElement;
    if (img) {
      img.src = `/py?${new Date().getTime()}`;
      setStreamReady(false);
    }
  };

  // Load snapshots and set up refreshing
  useEffect(() => {
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

    loadSnapshots();

    // Set up periodic refresh
    const refreshInterval = setInterval(refreshStream, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const deleteSnapshot = (id: string) => {
    const updatedSnapshots = snapshots.filter(snap => snap.id !== id);
    setSnapshots(updatedSnapshots);
    // Update localStorage when deleting
    localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updatedSnapshots));
  };

  const clearAllSnapshots = () => {
    setSnapshots([]);
    localStorage.setItem(SNAPSHOTS_STORAGE_KEY, '[]');
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Camera Snapshots
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          View and manage captured images from your surveillance system
        </p>
      </div>

      {/* Live Stream Preview */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Live Preview</h2>
          <button
            onClick={refreshStream}
            className="px-3 py-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg transition-colors text-sm flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
        <div className="aspect-video relative rounded-lg overflow-hidden bg-black/40">
          <img
            id="live-stream"
            src="/py"
            alt="Live Stream"
            className="w-full h-full object-contain"
            onLoad={() => setStreamReady(true)}
            onError={(e) => {
              console.error('Stream error:', e);
              setStreamReady(false);
              setStreamError('Failed to load camera stream. Please check if the Raspberry Pi camera server is running.');
            }}
          />

          {streamError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-red-400 text-center p-4">
                <p>{streamError}</p>
                <button
                  onClick={() => {
                    setStreamError(null);
                    setStreamReady(false);
                    refreshStream();
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          )}

          {!streamReady && !streamError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-blue-400 text-center">
                <svg className="animate-spin h-10 w-10 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Loading camera stream...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Snapshots Gallery */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Captured Snapshots</h2>
          <div className="flex space-x-2">
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Capture More</span>
            </Link>
            {snapshots.length > 0 && (
              <button
                onClick={clearAllSnapshots}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
        {snapshots.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-black/20 rounded-lg border border-zinc-800/30 backdrop-blur-sm">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>No snapshots captured yet.</p>
            <Link href="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
              Return to Live View
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="bg-gradient-to-br from-zinc-900/90 to-black/90 rounded-lg border border-zinc-800/30 p-4 shadow-xl hover:shadow-blue-900/10 hover:border-blue-500/30 transition-all group">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 mb-4">
                  <img
                    src={snapshot.imageData}
                    alt={`Snapshot from ${snapshot.timestamp}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <time className="text-sm text-gray-400">
                      {snapshot.timestamp}
                    </time>
                    <button
                      onClick={() => deleteSnapshot(snapshot.id)}
                      className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-900/20"
                      title="Delete snapshot"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={snapshot.imageData}
                      download={`snapshot-${snapshot.timestamp.replace(/[/\\:]/g, '-')}.jpg`}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all text-center flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}