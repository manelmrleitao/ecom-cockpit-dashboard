/**
 * CRO Scoring System
 * Calcula score final baseado em pesos por subcategoria
 * e gera sugestões de otimização
 */

// Pesos por subcategoria (definirei com base no impacto na conversão)
export const SUBCATEGORY_WEIGHTS: Record<string, number> = {
  // Site - 40% do score total
  'Geral negócio': 5,
  'Performance': 8,
  'HomePage': 10,
  'Página de Categoria': 8,
  'Página de Produto': 12,
  'Header': 4,
  'Página de carrinho/popup carrinho': 7,
  'CheckOut': 15,

  // User Experience - 10%
  'Geral': 10,

  // Google Analytics - 15%
  'dados gerais': 15,

  // Ads - 35%
  'Facebook Ads dados gerais': 17,
  'Google Ads dados gerais': 18,
}

// Valor máximo por resposta (conforme tipo)
const MAX_VALUES: Record<string, number> = {
  yes_no: 1, // Sim = 1, Não = 0
  rating_5: 5,
  rating_10: 10,
  percentage: 100,
  number: 100, // Assume valores 0-100
  currency: 100, // Assume valores positivos como score
  classification: 5, // A=5, B=4, C=3, D=2, F=1
}

interface ChecklistTask {
  id: string
  task: string
  type: string
  value: string | null
  status: string
}

interface SubcategoryScore {
  name: string
  completed: number
  total: number
  score: number // 0-100
  weight: number
  weighted: number // score * weight / 100
}

interface CROScore {
  overallScore: number // 0-100
  bySubcategory: Record<string, SubcategoryScore>
  suggestions: CROMuggestion[]
}

interface CROMuggestion {
  type: 'critical' | 'warning' | 'opportunity'
  title: string
  description: string
  subcategories: string[]
  estimatedImpact: string
}

export function calculateTaskScore(task: ChecklistTask): number {
  if (task.value === null) return 0

  switch (task.type) {
    case 'yes_no':
      return task.value === 'sim' ? 1 : 0

    case 'rating_5':
    case 'rating_10':
      const numValue = parseInt(task.value, 10)
      const max = MAX_VALUES[task.type]
      return Math.min(numValue, max) / max

    case 'percentage':
      const percent = parseInt(task.value, 10)
      return Math.min(percent, 100) / 100

    case 'classification':
      const grades: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, F: 1 }
      return (grades[task.value] || 0) / 5

    case 'number':
    case 'currency':
      // Assume positivo = bom
      return task.value ? 1 : 0

    default:
      return 0
  }
}

export function calculateCROScore(
  categories: Array<{
    name: string
    subcategories: Array<{
      name: string
      tasks: ChecklistTask[]
    }>
  }>
): CROScore {
  const bySubcategory: Record<string, SubcategoryScore> = {}
  let totalWeightedScore = 0
  let totalWeight = 0

  // Calcular score por subcategoria
  categories.forEach((category) => {
    category.subcategories.forEach((subcat) => {
      const weight = SUBCATEGORY_WEIGHTS[subcat.name] || 5
      const taskScores = subcat.tasks.map((task) => calculateTaskScore(task))
      const completed = subcat.tasks.filter((t) => t.value !== null).length
      const total = subcat.tasks.length

      const subcategoryScore =
        total > 0 ? (taskScores.reduce((a, b) => a + b, 0) / total) * 100 : 0

      bySubcategory[subcat.name] = {
        name: subcat.name,
        completed,
        total,
        score: Math.round(subcategoryScore),
        weight,
        weighted: (subcategoryScore * weight) / 100,
      }

      totalWeightedScore += bySubcategory[subcat.name].weighted
      totalWeight += weight
    })
  })

  const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / (totalWeight / 100)) : 0

  // Gerar sugestões
  const suggestions = generateCROSuggestions(bySubcategory, overallScore)

  return {
    overallScore,
    bySubcategory,
    suggestions,
  }
}

function generateCROSuggestions(
  bySubcategory: Record<string, SubcategoryScore>,
  overallScore: number
): CROMuggestion[] {
  const suggestions: CROMuggestion[] = []

  // Identificar subcategorias com baixo score
  const lowScores = Object.entries(bySubcategory)
    .filter(([_, sub]) => sub.score < 50)
    .map(([name]) => name)
    .slice(0, 3)

  const mediumScores = Object.entries(bySubcategory)
    .filter(([_, sub]) => sub.score >= 50 && sub.score < 75)
    .map(([name]) => name)

  // CRÍTICO: Checkout (maior impacto na conversão)
  if (bySubcategory['CheckOut']?.score < 60) {
    suggestions.push({
      type: 'critical',
      title: '🔴 CRÍTICO: Otimizar CheckOut',
      description:
        'CheckOut é o gargalo de conversão. Implementar one-page checkout, guest option, múltiplos métodos de pagamento.',
      subcategories: ['CheckOut'],
      estimatedImpact: '+15-25% conversão',
    })
  }

  // CRÍTICO: Página de Produto
  if (bySubcategory['Página de Produto']?.score < 50) {
    suggestions.push({
      type: 'critical',
      title: '🔴 CRÍTICO: Página de Produto Incompleta',
      description:
        'Sem fotos de qualidade, descrições, reviews ou guias de tamanho. Impacto direto em conversão.',
      subcategories: ['Página de Produto'],
      estimatedImpact: '+10-20% conversão',
    })
  }

  // WARNING: Performance do site
  if (bySubcategory['Performance']?.score < 60) {
    suggestions.push({
      type: 'warning',
      title: '⚠️ Performance do Site (< 2s load)',
      description:
        'Otimizar imagens, lazy loading, compressão. Sites lentos perdem 10-20% de conversões.',
      subcategories: ['Performance'],
      estimatedImpact: '+5-15% conversão',
    })
  }

  // WARNING: HomePage
  if (bySubcategory['HomePage']?.score < 65) {
    suggestions.push({
      type: 'warning',
      title: '⚠️ HomePage Não Converte',
      description:
        'Melhorar Hero Banner, adicionar social proof, clarificar value proposition, CTA claro.',
      subcategories: ['HomePage'],
      estimatedImpact: '+5-10% conversão',
    })
  }

  // OPPORTUNITY: Escalabilidade
  if (overallScore > 70) {
    suggestions.push({
      type: 'opportunity',
      title: '🚀 Site Bem Otimizado - Escalar Traffic',
      description:
        'Com score acima de 70%, está pronto para aumentar budget em publicidade. Conversão otimizada.',
      subcategories: Object.keys(bySubcategory).filter((k) => bySubcategory[k].score > 70),
      estimatedImpact: 'Suporta +100% traffic',
    })
  }

  // General insights
  if (overallScore < 40) {
    suggestions.push({
      type: 'critical',
      title: '🔧 Site Precisa Reformulação',
      description:
        'Score abaixo de 40%. Priorizar: Checkout, Página de Produto, Performance. ROI muito afetado.',
      subcategories: lowScores,
      estimatedImpact: '+30-50% conversão possível',
    })
  }

  return suggestions
}

export function generateCRORecommendations(overallScore: number): string[] {
  const recs: string[] = []

  if (overallScore >= 80) {
    recs.push('✅ Excelente - Site altamente otimizado para conversão. Foco: A/B testing e incrementais.')
  } else if (overallScore >= 60) {
    recs.push('⚠️ Bom - Mas ainda há espaço. Foque nos itens críticos identificados.')
  } else if (overallScore >= 40) {
    recs.push('🔴 Precisa Melhorias - Defina plano de ação para principais gargalos.')
  } else {
    recs.push('🚨 Crítico - Site não está otimizado para conversão. Revisão completa necessária.')
  }

  return recs
}
