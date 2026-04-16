'use client'

/**
 * Componente StoreTabs
 * Abas para alternar entre diferentes lojas/ecommerce (compacto)
 */

import { useState } from 'react'

interface Store {
  id: string
  name: string
  icon: string
  orders: number
}

const MOCK_STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Loja Principal',
    icon: '🏪',
    orders: 154,
  },
  {
    id: 'store-2',
    name: 'Marketplace',
    icon: '🛍️',
    orders: 89,
  },
  {
    id: 'store-3',
    name: 'Pop-up Store',
    icon: '🎪',
    orders: 34,
  },
]

export function StoreTabs() {
  const [activeStore, setActiveStore] = useState('store-1')

  return (
    <div className="flex gap-2 flex-wrap">
      {MOCK_STORES.map((store) => (
        <button
          key={store.id}
          onClick={() => setActiveStore(store.id)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
            activeStore === store.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-1">{store.icon}</span>
          {store.name}
        </button>
      ))}
    </div>
  )
}
