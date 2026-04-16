'use client'

/**
 * Componente BudgetTracking
 * Rastreia gastos vs. orçamento planejado
 */

interface BudgetItem {
  platform: string
  icon: string
  spent: number
  budget: number
  pacing: number // dias decorridos
}

interface BudgetTrackingProps {
  budgets: BudgetItem[]
  totalSpent: number
  totalBudget: number
}

export function BudgetTracking({ budgets, totalSpent, totalBudget }: BudgetTrackingProps) {
  const totalBurnRate = (totalSpent / totalBudget) * 100
  const daysInMonth = 30
  const daysRemaining = daysInMonth - Math.floor(totalBurnRate / 3) // simplificado
  const projectedSpend = (totalSpent / (daysInMonth - daysRemaining)) * daysInMonth

  const isBudgetOk = projectedSpend <= totalBudget
  const burnRatePercentage = totalBurnRate.toFixed(1)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">💳 Rastreamento de Orçamento</h3>

      {/* Total Budget Overview */}
      <div className={`${isBudgetOk ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <p className={`text-sm font-semibold ${isBudgetOk ? 'text-emerald-700' : 'text-red-700'}`}>
            Orçamento Total
          </p>
          <p className="text-sm font-bold text-gray-900">€{totalBudget.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</p>
        </div>

        <div className="w-full bg-gray-300 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full ${isBudgetOk ? 'bg-emerald-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(totalBurnRate, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs">
          <p className="text-gray-600">
            Gasto: <span className="font-bold text-gray-900">€{totalSpent.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</span>
          </p>
          <p className={`font-bold ${isBudgetOk ? 'text-emerald-700' : 'text-red-700'}`}>
            {burnRatePercentage}%
          </p>
        </div>

        {!isBudgetOk && (
          <p className="text-xs text-red-600 font-semibold mt-2">
            ⚠️ Projeção: excesso de €{(projectedSpend - totalBudget).toLocaleString('pt-PT', { maximumFractionDigits: 0 })}
          </p>
        )}
      </div>

      {/* Per-Platform Budget */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-600">Detalhes por Fonte de Aquisição</p>
        {budgets.map((budget, idx) => {
          const platformBurnRate = (budget.spent / budget.budget) * 100
          const isOver = budget.spent > budget.budget

          return (
            <div key={idx} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{budget.icon}</span>
                  <p className="text-sm font-medium text-gray-900">{budget.platform}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  €{budget.spent.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} / €{budget.budget.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${isOver ? 'bg-red-500' : platformBurnRate > 75 ? 'bg-amber-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(platformBurnRate, 100)}%` }}
                />
              </div>

              <p className={`text-xs mt-1 ${isOver ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                {platformBurnRate.toFixed(0)}% {isOver && '⚠️ Orçamento excedido'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
