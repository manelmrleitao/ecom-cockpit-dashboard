'use client'

/**
 * Componente StoreDropdown
 * Selecionador de loja em dropdown
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
]

interface StoreDropdownProps {
  selectedStore?: string
  onStoreChange?: (storeId: string) => void
}

export function StoreDropdown({ selectedStore = 'store-1', onStoreChange }: StoreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const activeStore = MOCK_STORES.find((s) => s.id === selectedStore) || MOCK_STORES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <span>{activeStore.icon}</span>
        <span>{activeStore.name}</span>
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {MOCK_STORES.map((store) => (
            <button
              key={store.id}
              onClick={() => {
                onStoreChange?.(store.id)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                selectedStore === store.id
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{store.icon}</span>
              <span>{store.name}</span>
              <span className="text-xs text-gray-500 ml-2">({store.orders})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
