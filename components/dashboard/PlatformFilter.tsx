'use client'

/**
 * Componente PlatformFilter
 * Filtro para selecionar plataforma publicitária
 */

interface PlatformFilterProps {
  selectedPlatform: string
  onPlatformChange: (platform: string) => void
}

const PLATFORMS = [
  { id: 'all', label: 'Todas', icon: '🌍' },
  { id: 'google-ads', label: 'Google', icon: '🔍' },
  { id: 'meta-ads', label: 'Meta', icon: '📱' },
  { id: 'tiktok-ads', label: 'TikTok', icon: '🎵' },
  { id: 'pinterest', label: 'Pinterest', icon: '📌' },
  { id: 'organic', label: 'Orgânico', icon: '🌱' },
]

export function PlatformFilter({ selectedPlatform, onPlatformChange }: PlatformFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {PLATFORMS.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onPlatformChange(platform.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedPlatform === platform.id
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-2">{platform.icon}</span>
          {platform.label}
        </button>
      ))}
    </div>
  )
}
