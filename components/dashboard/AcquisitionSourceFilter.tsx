'use client'

import { useState, useEffect, useRef } from 'react'

interface AcquisitionSourceFilterProps {
  selectedSources: string[]
  onSourceChange: (sources: string[]) => void
  period?: string
}

export function AcquisitionSourceFilter({ selectedSources, onSourceChange, period = 'last30' }: AcquisitionSourceFilterProps) {
  const [sources, setSources] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch available sources
  useEffect(() => {
    const fetchSources = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/shopify/acquisition-sources?period=${period}`)
        const data = await response.json()
        setSources(data.sources || [])
      } catch (error) {
        console.error('Failed to fetch acquisition sources:', error)
        setSources(['Direct', 'Organic', 'Instagram', 'TikTok', 'Google', 'Unknown'])
      } finally {
        setLoading(false)
      }
    }

    fetchSources()
  }, [period])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleSource = (source: string) => {
    const newSelected = selectedSources.includes(source)
      ? selectedSources.filter((s) => s !== source)
      : [...selectedSources, source]
    onSourceChange(newSelected)
  }

  const selectAll = () => {
    onSourceChange(sources)
  }

  const clearAll = () => {
    onSourceChange([])
  }

  const getSourceIcon = (source: string): string => {
    const icons: Record<string, string> = {
      Instagram: '📱',
      Facebook: 'f',
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
      >
        <span>🎯 Fontes de Aquisição</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="flex gap-2 text-xs">
              <button
                onClick={selectAll}
                className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
              >
                Selecionar Tudo
              </button>
              <button
                onClick={clearAll}
                className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Carregando...</div>
            ) : sources.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">Nenhuma fonte encontrada</div>
            ) : (
              sources.map((source) => (
                <label key={source} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source)}
                    onChange={() => toggleSource(source)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-lg">{getSourceIcon(source)}</span>
                  <span className="text-sm text-gray-700">{source}</span>
                </label>
              ))
            )}
          </div>

          {selectedSources.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-xs text-gray-600">
              {selectedSources.length} fonte(s) selecionada(s)
            </div>
          )}
        </div>
      )}
    </div>
  )
}
