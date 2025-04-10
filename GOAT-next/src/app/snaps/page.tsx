"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Snapshot = {
  id: string;
  imageData: string;
  timestamp: string;
};

const SNAPSHOTS_STORAGE_KEY = 'hms-snapshots';

export default function SnapsPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  // Load all snapshots from localStorage
  useEffect(() => {
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
        </div>
        <div className="aspect-video relative rounded-lg overflow-hidden bg-black/40">
          <img
            src="/py"
            alt="Live Stream"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Snapshots Gallery */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Captured Snapshots</h2>
          {snapshots.length > 0 && (
            <button
              onClick={clearAllSnapshots}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
            >
              Clear All
            </button>
          )}
        </div>
        {snapshots.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No snapshots captured yet. Return to the live view to capture images.
          </div>
        ) : (
          <div className="grid-gallery">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="card group hover:border-blue-500/50 transition-colors">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 mb-4">
                  <img
                    src={snapshot.imageData}
                    alt={`Snapshot from ${snapshot.timestamp}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <time className="text-sm text-gray-400">
                      {snapshot.timestamp}
                    </time>
                    <button
                      onClick={() => deleteSnapshot(snapshot.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
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
                      download={`snapshot-${snapshot.timestamp}.jpg`}
                      className="btn bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      Download
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
