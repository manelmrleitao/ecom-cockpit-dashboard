'use client'

/**
 * Componente PlatformDropdown
 * Seletor de plataformas com swatch images (multi-select)
 */

interface Platform {
  id: string
  label: string
}

const PLATFORM_LABELS: Record<string, { label: string }> = {
  'google-ads': { label: 'Google' },
  'meta-ads': { label: 'Meta' },
  'tiktok-ads': { label: 'TikTok' },
  pinterest: { label: 'Pinterest' },
  organic: { label: 'Orgânico' },
}

interface PlatformDropdownProps {
  selectedPlatforms: string[]
  onPlatformChange: (platforms: string[]) => void
  availablePlatforms?: string[]
}

export function PlatformDropdown({ selectedPlatforms, onPlatformChange, availablePlatforms }: PlatformDropdownProps) {
  const platforms: Platform[] = (availablePlatforms || Object.keys(PLATFORM_LABELS)).map((id) => ({
    id,
    label: PLATFORM_LABELS[id]?.label || id,
  }))
  const handleToggle = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onPlatformChange(selectedPlatforms.filter((p) => p !== platformId))
    } else {
      onPlatformChange([...selectedPlatforms, platformId])
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-600">Fontes de Aquisição:</span>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handleToggle(platform.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedPlatforms.includes(platform.id)
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={platform.label}
          >
            {platform.label}
          </button>
        ))}
      </div>
    </div>
  )
}
