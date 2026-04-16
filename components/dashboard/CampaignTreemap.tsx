'use client'

/**
 * CampaignTreemap Component
 * Mostra estrutura de campanhas em formato de árvore
 */

import { Treemap, Tooltip, ResponsiveContainer } from 'recharts'

interface CampaignData {
  name: string
  value: number
  roas?: number
  spend?: number
}

interface CampaignTreemapProps {
  data?: CampaignData[]
}

const DEFAULT_DATA = [
  { name: 'Google Ads', value: 8420.5, roas: 4.55, spend: 1850 },
  { name: 'Meta Ads', value: 5012.75, roas: 3.80, spend: 1320 },
  { name: 'TikTok Ads', value: 2414.25, roas: 5.37, spend: 450 },
  { name: 'Pinterest', value: 1850.00, roas: 4.87, spend: 380 },
  { name: 'Orgânico', value: 1109.00, roas: 0, spend: 0 },
]

export function CampaignTreemap({ data = DEFAULT_DATA }: CampaignTreemapProps) {
  const treeData = [
    {
      name: 'Campanhas',
      children: (data && data.length > 0 ? data : DEFAULT_DATA).map((item) => ({
        name: item.name,
        value: item.value,
        roas: item.roas,
        spend: item.spend,
      })),
    },
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Árvore de Campanhas (por Receita)</h3>

      <ResponsiveContainer width="100%" height={400}>
        <Treemap
          data={treeData}
          dataKey="value"
          aspectRatio={16 / 9}
          stroke="#fff"
          fill="#3b82f6"
          content={<CustomizedContent />}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
            }}
            formatter={(value: any) => [
              `€${(value as number).toLocaleString('pt-PT', { maximumFractionDigits: 0 })}`,
              'Receita',
            ]}
          />
        </Treemap>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        {(data && data.length > 0 ? data : DEFAULT_DATA).map((item) => (
          <div key={item.name} className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700">{item.name}</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              €{item.value.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}
            </p>
            {item.roas !== undefined && item.roas > 0 && (
              <p className="text-xs text-green-600 mt-1">ROAS: {item.roas.toFixed(2)}x</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Custom content renderer para o Treemap
function CustomizedContent(props: any) {
  const { x, y, width, height, name, value } = props

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: '#3b82f6',
          stroke: '#fff',
          strokeWidth: 2,
          opacity: 0.8,
        }}
      />
      {width > 50 && height > 50 && (
        <g>
          <text
            x={x + width / 2}
            y={y + height / 2 - 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 15}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
          >
            €{(value as number).toLocaleString('pt-PT', { maximumFractionDigits: 0 })}
          </text>
        </g>
      )}
    </g>
  )
}
