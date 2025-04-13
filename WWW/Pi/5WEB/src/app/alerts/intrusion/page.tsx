'use client'

import { useState } from 'react'
import Image from 'next/image'

type IntrusionAlert = {
    id: string
    timestamp: string
    imageUrl: string
    confidence: number
    location: string
}

export default function IntrusionAlertsPage() {
    // This would be replaced with actual data from your backend
    const [alerts] = useState<IntrusionAlert[]>([
        {
            id: '1',
            timestamp: new Date().toISOString(),
            imageUrl: '/placeholder-intrusion.jpg',
            confidence: 98.5,
            location: 'Front Door'
        },
        // Add more sample data as needed
    ])

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                    Intrusion Alerts
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    View detected intrusion events and related images
                </p>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Recent Detections</h2>
                    <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-400">System Active</span>
                    </div>
                </div>

                {alerts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No intrusion events detected. The system is actively monitoring.
                    </div>
                ) : (
                    <div className="grid-gallery">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="card group hover:border-red-500/50 transition-colors">
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 mb-4">
                                    <Image
                                        src={alert.imageUrl}
                                        alt={`Intrusion at ${alert.location}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-red-500/90 text-white text-sm px-2 py-1 rounded-full">
                                        {alert.confidence.toFixed(1)}% Confidence
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-red-400">
                                                Intrusion Detected
                                            </h3>
                                            <p className="text-sm text-gray-400">{alert.location}</p>
                                        </div>
                                        <time className="text-sm text-gray-500">
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </time>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="btn bg-red-600 hover:bg-red-700">
                                            View Details
                                        </button>
                                        <button className="btn bg-gray-600 hover:bg-gray-700">
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card bg-gradient-to-br from-red-900/30 to-orange-900/30">
                <h2 className="text-2xl font-semibold mb-4">Detection Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-black/40">
                        <div className="text-sm text-gray-400">Today</div>
                        <div className="text-2xl font-semibold text-red-400">
                            {alerts.length}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40">
                        <div className="text-sm text-gray-400">This Week</div>
                        <div className="text-2xl font-semibold text-orange-400">12</div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40">
                        <div className="text-sm text-gray-400">Average Response</div>
                        <div className="text-2xl font-semibold text-yellow-400">2.3s</div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40">
                        <div className="text-sm text-gray-400">Accuracy</div>
                        <div className="text-2xl font-semibold text-green-400">99.2%</div>
                    </div>
                </div>
            </div>
        </div>
    )
} 