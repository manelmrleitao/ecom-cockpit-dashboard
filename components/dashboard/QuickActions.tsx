'use client'

/**
 * Componente QuickActions
 * CTAs rápidas para ações comuns
 */

interface Action {
  id: string
  label: string
  icon: string
  description: string
  type: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
}

interface QuickActionsProps {
  actions: Action[]
}

export function QuickActions({ actions }: QuickActionsProps) {
  const getButtonStyle = (type: string) => {
    switch (type) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white'
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-900'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">⚡ Ações Rápidas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`rounded-lg p-3 transition-colors text-left group ${getButtonStyle(action.type)}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl mt-0.5">{action.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-0.5">{action.label}</p>
                <p className="text-xs opacity-75">{action.description}</p>
              </div>
            </div>
            <p className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
              Clique para executar →
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
