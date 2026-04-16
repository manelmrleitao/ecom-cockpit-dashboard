'use client'

/**
 * Setup Guide Page - Beautiful SOP for all platform integrations
 */

import { useState } from 'react'
import { ChevronDown, Check, Clock, AlertCircle, Copy } from 'lucide-react'

type PlatformStatus = 'completed' | 'next' | 'pending'

interface Platform {
  id: string
  name: string
  emoji: string
  status: PlatformStatus
  time: string
  description: string
  requirements: string[]
  steps: Array<{
    title: string
    description: string
    code?: string
  }>
  docs?: string
}

const platforms: Platform[] = [
  {
    id: 'meta',
    name: 'Meta Ads',
    emoji: '📱',
    status: 'completed',
    time: '15 min',
    description: 'Integração com Meta/Facebook Ads para dados de campanhas',
    requirements: [
      'Conta do Facebook Business Manager',
      'App criada no Meta for Developers',
    ],
    steps: [
      {
        title: 'Acede a Facebook Developers',
        description:
          'Vai a developers.facebook.com e faz login com a conta de Business Manager',
      },
      {
        title: 'Cria uma Nova App',
        description:
          'Tipo: Business | Nome: "Ecom Cockpit" | Propósito: Ads',
      },
      {
        title: 'Customize use case',
        description:
          'Vai a "Create & manage ads with Marketing API" e adiciona o teu Ad Account ID',
      },
      {
        title: 'Gera Access Token',
        description:
          'Graph API Explorer > Seleciona a app > Adiciona permissões (ads_read + ads_management) > Generate Access Token',
      },
      {
        title: 'Adiciona ao .env.local',
        description: 'Copia as credenciais para o ficheiro de configuração',
        code: `META_ADS_ACCOUNT_ID=769401137294776
META_ADS_ACCESS_TOKEN=EAAL5t2X6gTgBRAjbGkUj5YWg96dOc0SQKs...`,
      },
      {
        title: 'Reinicia o servidor',
        description:
          'npm run dev - O dashboard mostrará um aviso verde confirmando a conexão',
      },
    ],
    docs: 'https://developers.facebook.com/docs/marketing-api',
  },
  {
    id: 'google',
    name: 'Google Ads',
    emoji: '🔍',
    status: 'next',
    time: '20 min',
    description: 'Integração com Google Ads para gastos e conversões',
    requirements: [
      'Conta do Google Ads',
      'Google Cloud Project',
      'OAuth2 Client ID & Secret',
    ],
    steps: [
      {
        title: 'Google Cloud Console',
        description: 'Cria um novo projeto em console.cloud.google.com',
      },
      {
        title: 'Ativa Google Ads API',
        description: 'Search "Google Ads API" e clica Enable',
      },
      {
        title: 'OAuth2 Credentials',
        description:
          'Credentials > Create > OAuth 2.0 Client ID > Desktop Application',
      },
      {
        title: 'Obtém Refresh Token',
        description:
          'Segue o fluxo OAuth em http://localhost:3005/api/auth/google/callback',
      },
      {
        title: 'Recolhe IDs',
        description:
          'Customer ID (Google Ads > Tools & Settings) e Developer Token (API Center)',
      },
      {
        title: 'Adiciona ao .env.local',
        description: 'Adiciona todas as credenciais',
        code: `GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_ADS_REFRESH_TOKEN=1//0eXxxx
GOOGLE_ADS_DEVELOPER_TOKEN=ca~xxx`,
      },
    ],
    docs: 'https://developers.google.com/google-ads/api/docs/start',
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    emoji: '🎵',
    status: 'pending',
    time: '10 min',
    description: 'Integração com TikTok Ads para campanhas e ROI',
    requirements: [
      'Conta do TikTok Ads Manager',
      'TikTok for Business Account',
    ],
    steps: [
      {
        title: 'Acede TikTok Ads Manager',
        description: 'Vai a ads.tiktok.com',
      },
      {
        title: 'Cria API App',
        description:
          'Settings > Assets > Developer > Nova API App (Nome: "Ecom Cockpit")',
      },
      {
        title: 'Gera Access Token',
        description: 'Clica Generate Token e autoriza com a conta TikTok',
      },
      {
        title: 'Business Central ID',
        description:
          'Settings > Account > procura "Business Central ID" e copia',
      },
      {
        title: 'Adiciona ao .env.local',
        description: 'Adiciona as credenciais',
        code: `TIKTOK_ADS_ACCESS_TOKEN=acd...
TIKTOK_ADS_BUSINESS_CENTRAL_ID=xxx`,
      },
    ],
    docs: 'https://ads.tiktok.com/marketing_api/docs',
  },
  {
    id: 'pinterest',
    name: 'Pinterest Ads',
    emoji: '📌',
    status: 'pending',
    time: '10 min',
    description: 'Integração com Pinterest Ads Manager',
    requirements: ['Conta do Pinterest Ads Manager', 'Pinterest Business Account'],
    steps: [
      {
        title: 'Pinterest Business',
        description: 'Vai a business.pinterest.com',
      },
      {
        title: 'Cria Token API',
        description: 'Settings > Conversions > API > Generate Token',
      },
      {
        title: 'Ad Account ID',
        description: 'Settings > Account > procura "Ad Account ID"',
      },
      {
        title: 'Adiciona ao .env.local',
        description: 'Adiciona as credenciais',
        code: `PINTEREST_ADS_ACCESS_TOKEN=v1...
PINTEREST_ADS_ACCOUNT_ID=xxx`,
      },
    ],
    docs: 'https://developers.pinterest.com/docs/api/overview',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    emoji: '🛍️',
    status: 'pending',
    time: '10 min',
    description: 'Integração com Shopify para dados de vendas',
    requirements: ['Loja Shopify ativa', 'Admin API access'],
    steps: [
      {
        title: 'Shopify Admin',
        description: 'Vai a admin.shopify.com',
      },
      {
        title: 'Develop Apps',
        description: 'Settings > Apps and integrations > Develop apps > Create an app',
      },
      {
        title: 'Ativa Permissões',
        description:
          'Configuration > Ativa: read_orders, read_products, read_customers',
      },
      {
        title: 'Install App',
        description: 'Clica Install app e copia o access token',
      },
      {
        title: 'Adiciona ao .env.local',
        description: 'Adiciona Store URL e API Token',
        code: `SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_API_TOKEN=shpat_xxx`,
      },
    ],
    docs: 'https://shopify.dev/docs/api/admin-rest',
  },
]

function PlatformCard({ platform }: { platform: Platform }) {
  const [expanded, setExpanded] = useState(false)

  const statusConfig = {
    completed: {
      color: 'bg-green-50 border-green-200',
      badge: 'bg-green-100 text-green-800',
      icon: <Check className="w-5 h-5 text-green-600" />,
    },
    next: {
      color: 'bg-blue-50 border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      icon: <AlertCircle className="w-5 h-5 text-blue-600" />,
    },
    pending: {
      color: 'bg-gray-50 border-gray-200',
      badge: 'bg-gray-100 text-gray-800',
      icon: <Clock className="w-5 h-5 text-gray-600" />,
    },
  }

  const config = statusConfig[platform.status]

  return (
    <div className={`border rounded-lg p-6 ${config.color}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{platform.emoji}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{platform.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{platform.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.badge}`}>
            {platform.time}
          </span>
          {config.icon}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 p-3 bg-white/50 hover:bg-white/80 rounded-lg transition-colors mb-4"
      >
        <span className="font-semibold text-gray-700">
          {expanded ? 'Ocultar' : 'Ver'} Passos
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expandable Content */}
      {expanded && (
        <div className="space-y-4">
          {/* Requirements */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📋 Requisitos:</h4>
            <ul className="space-y-1">
              {platform.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">📍 Passos:</h4>
            <div className="space-y-3">
              {platform.steps.map((step, i) => (
                <div key={i} className="bg-white/50 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-sm font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{step.title}</h5>
                      <p className="text-sm text-gray-700 mt-1">{step.description}</p>
                      {step.code && (
                        <div className="mt-2 bg-gray-900 text-gray-100 rounded p-3 text-xs font-mono overflow-x-auto relative">
                          <pre>{step.code}</pre>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(step.code!)
                            }}
                            className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                            title="Copiar"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Link */}
          {platform.docs && (
            <div className="pt-2 border-t border-gray-200">
              <a
                href={platform.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                📚 Ver Documentação Oficial →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SetupGuidePage() {
  const completedCount = platforms.filter((p) => p.status === 'completed').length
  const totalTime = platforms.reduce((sum, p) => {
    const minutes = parseInt(p.time)
    return sum + minutes
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Guia de Setup - Integrações
          </h1>
          <p className="text-lg text-gray-600">
            Configurar plataformas de anúncios passo-a-passo para o Ecom Cockpit
          </p>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {completedCount}/{platforms.length}
            </div>
            <p className="text-sm text-gray-600">Integrações Concluídas</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">{totalTime} min</div>
            <p className="text-sm text-gray-600">Tempo Total Estimado</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {platforms.length}
            </div>
            <p className="text-sm text-gray-600">Fontes de Aquisição Disponíveis</p>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg p-4 mb-8 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">📌 Legenda de Status:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">Próximo Passo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-500"></div>
              <span className="text-sm text-gray-700">Pendente</span>
            </div>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="space-y-4">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">💡 Ordem Recomendada:</h3>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-center gap-3">
              <span className="font-bold text-green-600">1.</span>
              <span>
                <strong>Meta Ads</strong> (15 min) - ✅ JÁ CONCLUÍDO
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <span>
                <strong>Shopify</strong> (10 min) - Próximo!
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-bold text-gray-600">3.</span>
              <span>
                <strong>TikTok Ads</strong> (10 min)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-bold text-gray-600">4.</span>
              <span>
                <strong>Pinterest</strong> (10 min)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-bold text-gray-600">5.</span>
              <span>
                <strong>Google Ads</strong> (20 min) - Mais complexo
              </span>
            </li>
          </ol>
          <p className="text-sm text-gray-600 mt-4 italic">
            Total: ~65 minutos para todas as 5 plataformas
          </p>
        </div>
      </div>
    </div>
  )
}
