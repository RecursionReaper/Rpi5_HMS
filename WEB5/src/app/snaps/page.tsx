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
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    const loadSnapshots = () => {
      const savedSnapshots = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
      const existingSnapshots: Snapshot[] = savedSnapshots ? JSON.parse(savedSnapshots) : [];

      const latestImage = localStorage.getItem('capturedImage');
      if (latestImage) {
        const newSnapshot = {
          id: new Date().getTime().toString(),
          imageData: latestImage,
          timestamp: new Date().toLocaleString(),
        };

        const updatedSnapshots = [newSnapshot, ...existingSnapshots];
        setSnapshots(updatedSnapshots);
        localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updatedSnapshots));
        localStorage.removeItem('capturedImage');
      } else {
        setSnapshots(existingSnapshots);
      }
    };

    loadSnapshots();

    const refreshInterval = setInterval(() => {
      const img = document.getElementById('live-stream') as HTMLImageElement;
      if (img) {
        img.src = `/py?${new Date().getTime()}`;
        setStreamReady(false);
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const deleteSnapshot = (id: string) => {
    const updatedSnapshots = snapshots.filter(snap => snap.id !== id);
    setSnapshots(updatedSnapshots);
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
          View and manage captured images from your surveillance system.
        </p>
      </div>

      {/* Live Stream Preview */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <div
          className="aspect-video rounded-xl overflow-hidden relative cursor-pointer group"
          onClick={() => setModalImage('/py')}
        >
          <img
            id="live-stream"
            src="/py"
            alt="Live Stream"
            className="w-full h-full object-contain bg-black/30"
            onLoad={() => setStreamReady(true)}
            onError={(e) => {
              console.error('Stream error:', e);
              setStreamReady(false);
              setStreamError('Failed to load camera stream. Please check if the Raspberry Pi camera server is running.');
            }}
          />
          {!streamReady && !streamError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-blue-400">
              <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
          {streamError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-400 p-4 text-center">
              {streamError}
            </div>
          )}
        </div>
      </div>

      {/* Snapshots Gallery */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Captured Snapshots</h2>
          <div className="flex space-x-2">
            <Link href="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              Capture More
            </Link>
            {snapshots.length > 0 && (
              <button
                onClick={clearAllSnapshots}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
        {snapshots.length === 0 ? (
          <div className="text-center text-gray-500 py-12 border border-zinc-700/40 rounded-lg bg-black/10">
            <p>No snapshots captured yet.</p>
            <Link href="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              Return to Live View
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800 shadow-md group hover:shadow-lg transition-all">
                <div
                  className="aspect-video rounded-lg overflow-hidden bg-black/30 mb-4 cursor-pointer"
                  onClick={() => setModalImage(snapshot.imageData)}
                >
                  <img
                    src={snapshot.imageData}
                    alt={`Snapshot ${snapshot.timestamp}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{snapshot.timestamp}</span>
                  <button
                    onClick={() => deleteSnapshot(snapshot.id)}
                    title="Delete"
                    className="text-red-500 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
                <a
                  href={snapshot.imageData}
                  download={`snapshot-${snapshot.timestamp.replace(/[/\\:]/g, '-')}.jpg`}
                  className="block mt-2 px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for enlarged image */}
      {modalImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setModalImage(null)}>
          <img src={modalImage} className="max-w-5xl max-h-[90vh] rounded-lg shadow-2xl border border-zinc-700" />
          <button
            onClick={() => setModalImage(null)}
            className="absolute top-6 right-6 text-white bg-zinc-700/50 hover:bg-zinc-600/70 rounded-full p-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
