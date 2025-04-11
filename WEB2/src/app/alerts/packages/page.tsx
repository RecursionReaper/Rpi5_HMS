'use client'

import { useState } from 'react'
import Image from 'next/image'

type PackageAlert = {
    id: string
    timestamp: string
    imageUrl: string
    status: 'delivered' | 'picked_up'
    carrier?: string
    duration?: string
}

export default function PackageAlertsPage() {
    // This would be replaced with actual data from your backend
    const [alerts] = useState<PackageAlert[]>([
        {
            id: '1',
            timestamp: new Date().toISOString(),
            imageUrl: '/placeholder-package.jpg',
            status: 'delivered',
            carrier: 'FedEx',
            duration: '2h 15m'
        },
        // Add more sample data as needed
    ])

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    Package Alerts
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Monitor package deliveries and pickups at your doorstep
                </p>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Recent Packages</h2>
                    <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-400">Monitoring Active</span>
                    </div>
                </div>

                {alerts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No package events detected. The system is actively monitoring.
                    </div>
                ) : (
                    <div className="grid-gallery">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="card group hover:border-green-500/50 transition-colors">
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 mb-4">
                                    <Image
                                        src={alert.imageUrl}
                                        alt={`Package ${alert.status}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className={`absolute top-2 right-2 text-white text-sm px-2 py-1 rounded-full ${alert.status === 'delivered' ? 'bg-green-500/90' : 'bg-blue-500/90'
                                        }`}>
                                        {alert.status === 'delivered' ? 'Delivered' : 'Picked Up'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-green-400">
                                                {alert.carrier || 'Unknown Carrier'}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {alert.status === 'delivered' ? 'At doorstep for' : 'Picked up after'} {alert.duration}
                                            </p>
                                        </div>
                                        <time className="text-sm text-gray-500">
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </time>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="btn bg-green-600 hover:bg-green-700">
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

            <div className="card bg-gradient-to-br from-green-900/30 to-emerald-900/30">
                <h2 className="text-2xl font-semibold mb-4">Package Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-black/40">
                        <div className="text-sm text-gray-400">Today's Deliveries</div>
                        <div className="text-2xl font-semibold text-green-400">
                            {alerts.filter(a => a.status === 'delivered').length}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40">
                        <div className="text-sm text-gray-400">Today's Pickups</div>
                        <div className="text-2xl font-semibold text-blue-400">
                            {alerts.filter(a => a.status === 'picked_up').length}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40">
                        <div className="text-sm text-gray-400">Average Wait Time</div>
                        <div className="text-2xl font-semibold text-yellow-400">1.8h</div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40">
                        <div className="text-sm text-gray-400">Detection Rate</div>
                        <div className="text-2xl font-semibold text-emerald-400">98.5%</div>
                    </div>
                </div>
            </div>
        </div>
    )
} 