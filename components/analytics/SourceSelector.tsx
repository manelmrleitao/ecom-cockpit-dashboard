'use client'

import { useState, useEffect } from 'react'

interface SourceSelectorProps {
  selectedSource: string
  onSourceChange: (source: string) => void
  period?: string
}

export function SourceSelector({ selectedSource, onSourceChange, period = 'last30' }: SourceSelectorProps) {
  const [sources, setSources] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSources = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/shopify/acquisition-sources?period=${period}`)
        const data = await response.json()
        setSources(data.sources || [])

        // Se não há seleção, selecionar a primeira
        if (!selectedSource && data.sources && data.sources.length > 0) {
          onSourceChange(data.sources[0])
        }
      } catch (error) {
        console.error('Failed to fetch sources:', error)
        setSources(['Direct', 'Organic', 'Instagram', 'TikTok', 'Google', 'Unknown'])
      } finally {
        setLoading(false)
      }
    }

    fetchSources()
  }, [period, selectedSource, onSourceChange])

  const getSourceIcon = (source: string): string => {
    const icons: Record<string, string> = {
      Instagram: '📱',
      Facebook: '👥',
      TikTok: '🎵',
      Pinterest: '📌',
      Google: '🔍',
      'Google Ads': '🎯',
      YouTube: '▶️',
      Linktree: '🔗',
      Direct: '⚡',
      Email: '✉️',
      Organic: '🌱',
      Unknown: '❓',
    }
    return icons[source] || '•'
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Fonte de Aquisição:</label>
      <select
        value={selectedSource}
        onChange={(e) => onSourceChange(e.target.value)}
        disabled={loading || sources.length === 0}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:opacity-50"
      >
        <option value="">
          {loading ? 'Carregando fontes...' : 'Seleciona uma fonte...'}
        </option>
        {sources.map((source) => (
          <option key={source} value={source}>
            {getSourceIcon(source)} {source}
          </option>
        ))}
      </select>
    </div>
  )
}
