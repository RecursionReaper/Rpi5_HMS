"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Snapshot = {
  id: string;
  imageData: string;
  timestamp: string;
  captureDate?: Date; // For sorting
};

const SNAPSHOTS_STORAGE_KEY = 'hms-snapshots';

export default function SnapsPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [streamStatus, setStreamStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Refresh the stream
  const refreshStream = () => {
    setStreamStatus('loading');
    setErrorMessage(null);
    const img = document.getElementById('live-stream') as HTMLImageElement;
    if (img) {
      img.src = `/py?t=${new Date().getTime()}`;
      setLastRefreshed(new Date());
    }
  };

  // Load snapshots and set up refreshing
  useEffect(() => {
    // Load snapshots from localStorage
    const loadSnapshots = () => {
      // First, load existing snapshots
      const savedSnapshots = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
      const existingSnapshots: Snapshot[] = savedSnapshots ? JSON.parse(savedSnapshots) : [];

      // Process snapshots to ensure they have proper Date objects for sorting
      const processedSnapshots = existingSnapshots.map(snap => ({
        ...snap,
        captureDate: new Date(snap.timestamp)
      }));

      // Then, check for new capture
      const latestImage = localStorage.getItem('capturedImage');
      const timestamp = localStorage.getItem('captureTimestamp') || new Date().toISOString();

      if (latestImage) {
        const formattedTimestamp = new Date(timestamp).toLocaleString();
        const newSnapshot = {
          id: new Date().getTime().toString(),
          imageData: latestImage,
          timestamp: formattedTimestamp,
          captureDate: new Date(timestamp)
        };

        // Combine existing snapshots with new one
        const updatedSnapshots = [newSnapshot, ...processedSnapshots];
        setSnapshots(updatedSnapshots);

        // Save to localStorage
        localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updatedSnapshots));

        // Clear the temporary capture
        localStorage.removeItem('capturedImage');
        localStorage.removeItem('captureTimestamp');

        // Automatically select the new snapshot
        setSelectedSnapshot(newSnapshot);
      } else {
        // If no new capture, just set existing snapshots
        setSnapshots(processedSnapshots);
      }
    };

    loadSnapshots();

    // Set up periodic refresh
    const refreshInterval = setInterval(refreshStream, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Format time since last refresh
  const getTimeSinceRefresh = () => {
    const seconds = Math.floor((new Date().getTime() - lastRefreshed.getTime()) / 1000);
    return seconds < 60 ? `${seconds}s ago` : `${Math.floor(seconds / 60)}m ${seconds % 60}s ago`;
  };

  const deleteSnapshot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering selection

    if (selectedSnapshot && selectedSnapshot.id === id) {
      setSelectedSnapshot(null);
    }

    const updatedSnapshots = snapshots.filter(snap => snap.id !== id);
    setSnapshots(updatedSnapshots);
    // Update localStorage when deleting
    localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updatedSnapshots));
  };

  const clearAllSnapshots = () => {
    if (window.confirm('Are you sure you want to delete all snapshots? This cannot be undone.')) {
      setSnapshots([]);
      setSelectedSnapshot(null);
      localStorage.setItem(SNAPSHOTS_STORAGE_KEY, '[]');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'newest' ? 'oldest' : 'newest');
  };

  // Sort snapshots based on current sort order
  const sortedSnapshots = [...snapshots].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
          Camera Snapshots
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          View and manage captured images from your surveillance system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Stream Preview */}
        <div className="glass-card lg:col-span-1">
          <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
            <h2 className="text-lg font-medium flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${streamStatus === 'ready' ? 'bg-green-500 animate-pulse' :
                  streamStatus === 'loading' ? 'bg-amber-500 animate-pulse' :
                    'bg-red-500'
                }`}></div>
              Live Preview
            </h2>
            <div className="text-xs text-gray-400">
              Updated: {getTimeSinceRefresh()}
            </div>
          </div>

          <div className="p-4">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-black">
              <img
                id="live-stream"
                src={`/py?t=${new Date().getTime()}`}
                alt="Live Stream"
                className="w-full h-full object-contain"
                onLoad={() => setStreamStatus('ready')}
                onError={(e) => {
                  console.error('Stream error:', e);
                  setStreamStatus('error');
                  setErrorMessage('Failed to load camera stream. Please check if the Raspberry Pi camera server is running.');
                }}
              />

              {streamStatus === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-red-400 text-sm mb-3">{errorMessage}</p>
                    <button
                      onClick={() => {
                        setErrorMessage(null);
                        refreshStream();
                      }}
                      className="btn-secondary text-sm py-1.5"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>
              )}

              {streamStatus === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-center">
                    <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-indigo-300 text-sm">Loading stream...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-4">
              <Link
                href="/"
                className="btn flex-1 py-2 text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-7 13a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
                <span>Capture Mode</span>
              </Link>

              <button
                onClick={refreshStream}
                className="btn-secondary flex items-center justify-center p-2"
                title="Refresh Stream"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Snapshots Gallery and Viewer */}
        <div className="glass-card lg:col-span-2">
          <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
            <h2 className="text-lg font-medium">
              Captured Snapshots
              {snapshots.length > 0 && <span className="ml-2 badge">{snapshots.length}</span>}
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSortOrder}
                className="text-gray-400 hover:text-white transition-colors p-1.5 text-sm flex items-center"
                title={`Currently: ${sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    sortOrder === 'newest'
                      ? "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      : "M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                  } />
                </svg>
                {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
              </button>

              {snapshots.length > 0 && (
                <button
                  onClick={clearAllSnapshots}
                  className="text-red-400 hover:text-red-300 transition-colors p-1.5 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="p-4">
            {snapshots.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-black/20 rounded-lg border border-white/5 backdrop-blur-sm">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>No snapshots captured yet</p>
                <Link href="/" className="inline-block mt-4 btn py-2 px-4">
                  Capture New Snapshot
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {/* Selected snapshot viewer */}
                {selectedSnapshot && (
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-4 mb-2">
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-black mb-3">
                      <img
                        src={selectedSnapshot.imageData}
                        alt={`Snapshot from ${selectedSnapshot.timestamp}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <time className="text-sm text-gray-300 font-medium">
                        {selectedSnapshot.timestamp}
                      </time>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => deleteSnapshot(selectedSnapshot.id, e)}
                          className="btn-secondary py-1.5 px-3 text-sm text-red-400 hover:text-white flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                        <a
                          href={selectedSnapshot.imageData}
                          download={`snapshot-${selectedSnapshot.timestamp.replace(/[/\\:]/g, '-')}.jpg`}
                          className="btn py-1.5 px-3 text-sm flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sortedSnapshots.map((snapshot) => (
                    <div
                      key={snapshot.id}
                      className={`relative rounded-lg overflow-hidden bg-black/40 border ${selectedSnapshot?.id === snapshot.id
                          ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                          : 'border-white/10 hover:border-white/30'
                        } transition-all cursor-pointer`}
                      onClick={() => setSelectedSnapshot(snapshot)}
                    >
                      <div className="aspect-video">
                        <img
                          src={snapshot.imageData}
                          alt={`Snapshot from ${snapshot.timestamp}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                        <time className="text-xs text-gray-300">
                          {new Date(snapshot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                      <button
                        onClick={(e) => deleteSnapshot(snapshot.id, e)}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-900/20 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete snapshot"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}