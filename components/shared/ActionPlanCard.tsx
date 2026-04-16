'use client'

/**
 * Action Plan Card Component
 * Reutilizável em qualquer página que tenha sugestões/plano de ação
 */

import { useState } from 'react'
import { generateActionPlanPDF } from '@/lib/utils/generate-action-plan-pdf'

interface ActionItem {
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  impact?: string
  estimatedDays?: number
  priority?: number // Optional, used when flattening for PDF
}

interface ActionAxis {
  name: string
  icon: string
  items: ActionItem[]
  score?: number // Optional: health score in percentage (0-100)
}

interface ActionPlanCardProps {
  title?: string
  businessName?: string
  axes: ActionAxis[]
  onDownloadStart?: () => void
  onDownloadEnd?: () => void
}

const getPriorityColor = (type: string) => {
  switch (type) {
    case 'critical':
      return 'bg-red-50 border-red-300 border-l-4'
    case 'warning':
      return 'bg-yellow-50 border-yellow-300 border-l-4'
    case 'info':
      return 'bg-blue-50 border-blue-300 border-l-4'
    default:
      return 'bg-gray-50 border-gray-300'
  }
}

const getPriorityIcon = (type: string) => {
  switch (type) {
    case 'critical':
      return '🔴'
    case 'warning':
      return '⚠️'
    case 'info':
      return 'ℹ️'
    default:
      return '•'
  }
}

const calculateAxisScore = (items: ActionItem[]): number => {
  if (items.length === 0) return 100

  const criticalCount = items.filter((i) => i.type === 'critical').length
  const warningCount = items.filter((i) => i.type === 'warning').length

  // Score: 100 - penalty for critical and warning items
  const penalty = (criticalCount * 30 + warningCount * 15) / items.length
  return Math.max(0, Math.round(100 - penalty))
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-green-50 text-green-700'
  if (score >= 60) return 'bg-yellow-50 text-yellow-700'
  return 'bg-red-50 text-red-700'
}

export function ActionPlanCard({
  title = '📋 Plano de Ação',
  businessName = 'Negócio',
  axes,
  onDownloadStart,
  onDownloadEnd,
}: ActionPlanCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [expandedAxes, setExpandedAxes] = useState<Record<string, boolean>>(
    Object.fromEntries(axes.map((axis) => [axis.name, true]))
  )

  const toggleAxis = (axisName: string) => {
    setExpandedAxes((prev) => ({
      ...prev,
      [axisName]: !prev[axisName],
    }))
  }

  const totalItems = axes.reduce((sum, axis) => sum + axis.items.length, 0)
  const totalCritical = axes.reduce(
    (sum, axis) => sum + axis.items.filter(i => i.type === 'critical').length,
    0
  )

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    onDownloadStart?.()

    try {
      // Flatten axes into items for PDF, maintaining axis context in title
      const flatItems = axes.flatMap((axis) =>
        axis.items.map((item, itemIdx) => ({
          priority: itemIdx + 1,
          type: item.type,
          title: `${axis.name} - ${item.title}`,
          description: item.description,
          impact: item.impact,
          estimatedDays: item.estimatedDays,
        }))
      )

      const success = await generateActionPlanPDF(businessName, 65, flatItems)
      if (success) {
        console.log('PDF gerado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao descarregar PDF:', error)
    } finally {
      setIsDownloading(false)
      onDownloadEnd?.()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {totalItems} ações • {totalCritical} críticas
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
        >
          {isDownloading ? (
            <>
              <span className="animate-spin">⏳</span>
              Gerando...
            </>
          ) : (
            <>
              <span>📥</span>
              Download PDF
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {axes.map((axis) => (
          <div key={axis.name} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Axis Header - Collapsible */}
            <button
              onClick={() => toggleAxis(axis.name)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {/* Chevron */}
              <span
                className={`text-gray-600 font-bold transition-transform duration-200 ${
                  expandedAxes[axis.name] ? 'rotate-90' : 'rotate-0'
                }`}
              >
                ▶
              </span>

              {/* Icon and Name */}
              <span className="text-2xl">{axis.icon}</span>
              <h3 className="font-bold text-lg text-gray-900">{axis.name}</h3>

              {/* Score Badge */}
              {expandedAxes[axis.name] && (
                <>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${getScoreBgColor(
                      axis.score ?? calculateAxisScore(axis.items)
                    )}`}
                  >
                    {axis.score ?? calculateAxisScore(axis.items)}%
                  </span>

                  {/* Warnings Count */}
                  {axis.items.filter((i) => i.type === 'warning').length > 0 && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                      ⚠️ {axis.items.filter((i) => i.type === 'warning').length}
                    </span>
                  )}
                </>
              )}

              {/* Action Count Badge */}
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full ml-auto">
                {axis.items.length} ações
              </span>
            </button>

            {/* Axis Items - Collapsible */}
            {expandedAxes[axis.name] && (
              <div className="space-y-3 p-4 bg-white">
                {axis.items.map((item, idx) => (
                  <div
                    key={`${axis.name}-${item.title}`}
                    className={`p-4 rounded-lg ${getPriorityColor(item.type)}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Type Badge */}
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{getPriorityIcon(item.type)}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">{item.description}</p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-3 mt-3">
                          {item.impact && (
                            <div className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded border border-current border-opacity-20">
                              <span className="font-semibold">📈</span> {item.impact}
                            </div>
                          )}
                          {item.estimatedDays && (
                            <div className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded border border-current border-opacity-20">
                              <span className="font-semibold">⏱️</span> {item.estimatedDays}d
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-bold">💡 Dica:</span> Organize por eixo (CRO, Email, Ads) e implemente ações críticas
          (🔴) primeiro dentro de cada área. Cada ação tem impacto estimado no seu negócio.
        </p>
      </div>
    </div>
  )
}
