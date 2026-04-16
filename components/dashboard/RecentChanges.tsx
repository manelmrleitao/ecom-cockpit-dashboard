'use client'

/**
 * Componente RecentChanges
 * Timeline das mudanças recentes em campanhas
 */

interface Change {
  id: string
  timestamp: string
  action: string
  platform: string
  icon: string
  details: string
  type: 'pause' | 'resume' | 'adjustment' | 'launch' | 'note'
}

interface RecentChangesProps {
  changes: Change[]
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'pause':
      return 'bg-red-50 border-red-200 text-red-700'
    case 'resume':
      return 'bg-emerald-50 border-emerald-200 text-emerald-700'
    case 'adjustment':
      return 'bg-blue-50 border-blue-200 text-blue-700'
    case 'launch':
      return 'bg-purple-50 border-purple-200 text-purple-700'
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700'
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'pause':
      return '⏸️'
    case 'resume':
      return '▶️'
    case 'adjustment':
      return '⚙️'
    case 'launch':
      return '🚀'
    default:
      return '📝'
  }
}

export function RecentChanges({ changes }: RecentChangesProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">📋 Mudanças Recentes</h3>

      {changes.length === 0 ? (
        <p className="text-sm text-gray-600 italic">Nenhuma mudança registrada</p>
      ) : (
        <div className="space-y-3">
          {changes.map((change, idx) => (
            <div key={change.id} className={`border rounded-lg p-3 ${getTypeColor(change.type)}`}>
              <div className="flex gap-3">
                <div className="text-xl flex-shrink-0">{change.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-bold">{change.action}</p>
                    <p className="text-xs opacity-75">{change.timestamp}</p>
                  </div>
                  <p className="text-xs opacity-90 mb-1">{change.platform}</p>
                  <p className="text-xs opacity-75">{change.details}</p>
                </div>
              </div>

              {/* Timeline connector */}
              {idx < changes.length - 1 && (
                <div className="ml-5 mt-3 pb-2 border-l-2 border-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
