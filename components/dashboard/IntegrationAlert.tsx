'use client'

/**
 * Integration Alert Component
 * Shows warnings when platform integrations are not configured or failing
 */

import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface IntegrationAlertProps {
  errors?: Record<string, string>
  dataSources?: { shopify: boolean; googleAds: boolean; metaAds: boolean }
  isMock: boolean
}

export function IntegrationAlert({
  errors = {},
  dataSources = { shopify: false, googleAds: false, metaAds: false },
  isMock,
}: IntegrationAlertProps) {
  const hasErrors = Object.keys(errors).length > 0

  if (!hasErrors && !isMock) {
    return null
  }

  const integrationMap: Record<string, { label: string; key: string }> = {
    shopify: { label: 'Shopify', key: 'shopify' },
    googleAds: { label: 'Google Ads', key: 'googleAds' },
    metaAds: { label: 'Meta Ads', key: 'metaAds' },
  }

  const failedIntegrations = Object.entries(errors).map(([key, message]) => {
    const label = key === 'shopify' ? 'Shopify' : key === 'googleAds' ? 'Google Ads' : 'Meta Ads'
    return { label, message }
  })

  const workingIntegrations = Object.entries(dataSources)
    .filter(([_, isWorking]) => isWorking)
    .map(([key, _]) => integrationMap[key].label)

  return (
    <div className="space-y-3 mb-6">
      {/* Mock Data Warning */}
      {isMock && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900">Dados Demo</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Nenhuma integração está configurada. Está a ver dados de exemplo.
            </p>
          </div>
        </div>
      )}

      {/* Integration Errors */}
      {failedIntegrations.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Erro nas Integrações</h3>
            <ul className="text-sm text-red-800 mt-2 space-y-1">
              {failedIntegrations.map(({ label, message }) => (
                <li key={label} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <div>
                    <span className="font-medium">{label}:</span>
                    <p className="text-xs mt-0.5 opacity-90">{message}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-red-700 mt-3 font-medium">
              Verifique as configurações de ambiente em Settings → Integrações
            </p>
          </div>
        </div>
      )}

      {/* Working Integrations */}
      {workingIntegrations.length > 0 && !isMock && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900">Integrações Ativas</h3>
            <p className="text-sm text-green-800 mt-1">
              {workingIntegrations.join(', ')} {workingIntegrations.length === 1 ? 'está' : 'estão'} configurado{workingIntegrations.length === 1 ? 'a' : 's'} e funcionando.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
