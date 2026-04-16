/**
 * Date Helper Functions
 * Utilities for date range calculations and formatting
 */

export function getLast30Days(): { startDate: string; endDate: string } {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 30)

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  }
}

export function getLast90Days(): { startDate: string; endDate: string } {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 90)

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  }
}

export function getLastYear(): { startDate: string; endDate: string } {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setFullYear(startDate.getFullYear() - 1)

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  }
}

export function formatDateForAPI(date: Date): string {
  // Format as YYYY-MM-DD for API calls
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateParam(dateString: string): Date {
  // Parse date string from API (format: YYYY-MM-DD)
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseDateParam(date) : date
  return dateObj.toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getDaysSince(date: Date | string): number {
  const dateObj = typeof date === 'string' ? parseDateParam(date) : date
  const now = new Date()
  const diffTime = now.getTime() - dateObj.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function getPeriodDateRange(period?: string): { startDate: string; endDate: string } {
  const endDate = new Date()
  const startDate = new Date(endDate)

  switch (period) {
    case 'today':
      // Today only - start at 00:00, end at 23:59
      break
    case 'yesterday':
      startDate.setDate(startDate.getDate() - 1)
      endDate.setDate(endDate.getDate() - 1)
      break
    case 'last7':
      startDate.setDate(startDate.getDate() - 7)
      break
    case 'last90':
      startDate.setDate(startDate.getDate() - 90)
      break
    case 'last365':
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
    case 'last30':
    default:
      startDate.setDate(startDate.getDate() - 30)
      break
  }

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  }
}
