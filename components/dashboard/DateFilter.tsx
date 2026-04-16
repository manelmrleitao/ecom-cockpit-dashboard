'use client'

/**
 * Componente DateFilter - Estilo Shopify
 * Um único botão de período que abre modal com opções
 * Opções: Hoje, Ontem, Últimos 7 dias, Este Mês, Datas Customizadas
 */

import { useState } from 'react'

type DateRange = 'today' | 'yesterday' | 'last7' | 'last30' | 'mtd' | 'custom'

interface DateFilterProps {
  onDateChange?: (range: DateRange, startDate?: string, endDate?: string) => void
}

export function DateFilter({ onDateChange }: DateFilterProps) {
  const [activeRange, setActiveRange] = useState<DateRange>('last30')
  const [isOpen, setIsOpen] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  // Get display label for current range
  const getRangeLabel = (): string => {
    const today = new Date()
    const labels: Record<DateRange, string> = {
      'today': 'Hoje',
      'yesterday': 'Ontem',
      'last7': 'Últimos 7 dias',
      'last30': 'Últimos 30 dias',
      'mtd': 'Este mês',
      'custom': 'Datas customizadas',
    }
    return labels[activeRange] || 'Período'
  }

  const handleRangeSelect = (range: DateRange) => {
    setActiveRange(range)
    setShowCustomForm(false)

    if (range !== 'custom') {
      onDateChange?.(range)
      setIsOpen(false)
    }
  }

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      onDateChange?.('custom', customStartDate, customEndDate)
      setIsOpen(false)
    }
  }

  const presetRanges = [
    { key: 'today', label: 'Hoje', icon: '📅' },
    { key: 'yesterday', label: 'Ontem', icon: '📆' },
    { key: 'last7', label: 'Últimos 7 dias', icon: '📊' },
    { key: 'mtd', label: 'Este mês', icon: '📈' },
  ]

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          📅 {getRangeLabel()}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Preset Options */}
          {!showCustomForm && (
            <div className="p-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-600 uppercase px-2 py-1">
                Períodos Rápidos
              </h3>

              {presetRanges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => handleRangeSelect(range.key as DateRange)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeRange === range.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {range.icon} {range.label}
                </button>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-gray-200" />

              {/* Custom Option */}
              <button
                onClick={() => setShowCustomForm(true)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeRange === 'custom'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                📆 Datas Customizadas
              </button>
            </div>
          )}

          {/* Custom Date Form */}
          {showCustomForm && (
            <div className="p-4 space-y-3 border-t border-gray-200">
              <button
                onClick={() => setShowCustomForm(false)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium mb-2"
              >
                ← Voltar
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Data de início
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Data de fim
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCustomApply}
                    disabled={!customStartDate || !customEndDate}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Close modal when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
