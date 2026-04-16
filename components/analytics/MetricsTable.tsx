'use client'

/**
 * MetricsTable - Reusable table for displaying metrics
 */

export interface Column {
  key: string
  label: string
  width: string
  format?: 'currency' | 'number' | 'decimal' | 'percent'
}

interface MetricsTableProps<T = Record<string, any>> {
  columns: Column[]
  data: T[]
  onRowClick: (row: T) => void
  rowKey: string
}

function formatValue(value: any, format?: string): string {
  if (value === null || value === undefined) return '-'

  switch (format) {
    case 'currency':
      return `€${typeof value === 'number' ? value.toFixed(2) : value}`
    case 'number':
      return typeof value === 'number' ? Math.round(value).toString() : String(value)
    case 'decimal':
      return typeof value === 'number' ? value.toFixed(2) : String(value)
    case 'percent':
      return typeof value === 'number' ? `${value.toFixed(1)}%` : String(value)
    default:
      return String(value)
  }
}

export function MetricsTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  rowKey,
}: MetricsTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                Nenhum dado disponível
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={(row[rowKey as keyof T] as string) || idx}
                onClick={() => onRowClick(row)}
                className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {columns.map((col) => (
                  <td
                    key={`${row[rowKey as keyof T]}-${col.key}`}
                    style={{ width: col.width }}
                    className="px-4 py-3 text-sm text-gray-900"
                  >
                    {col.key === 'status' ? (
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          row[col.key as keyof T] === 'active'
                            ? 'bg-green-100 text-green-700'
                            : row[col.key as keyof T] === 'paused'
                              ? 'bg-yellow-100 text-yellow-700'
                              : row[col.key as keyof T] === 'learning'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {row[col.key as keyof T]}
                      </span>
                    ) : col.key === 'type' ? (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {row[col.key as keyof T]}
                      </span>
                    ) : (
                      formatValue(row[col.key as keyof T], col.format)
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
