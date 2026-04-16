'use client'

/**
 * PlatformSelector - Choose which platform to analyze
 */

import type { Platform } from './types'

interface PlatformSelectorProps {
  onSelectPlatform: (platform: Platform) => void
}

const PLATFORMS: Platform[] = [
  { id: 'google-ads', name: 'Google Ads', icon: '🔍', color: 'blue' },
  { id: 'meta-ads', name: 'Meta Ads', icon: '📱', color: 'purple' },
  { id: 'tiktok-ads', name: 'TikTok Ads', icon: '🎵', color: 'black' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', color: 'red' },
]

export function PlatformSelector({ onSelectPlatform }: PlatformSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {PLATFORMS.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onSelectPlatform(platform)}
          className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{platform.icon}</div>
          <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
          <p className="text-sm text-gray-500 mt-2">Ver campanhas e performance</p>
        </button>
      ))}
    </div>
  )
}
