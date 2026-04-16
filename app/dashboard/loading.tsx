/**
 * Dashboard Loading Skeleton
 * Displayed while the dashboard data is being fetched
 */

export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header skeleton */}
      <div className="h-8 w-64 bg-gray-200 rounded"></div>

      {/* Controls skeleton */}
      <div className="flex gap-3">
        <div className="h-10 w-48 bg-gray-200 rounded"></div>
        <div className="h-10 w-48 bg-gray-200 rounded"></div>
        <div className="h-10 flex-1 bg-gray-200 rounded"></div>
      </div>

      {/* Filter section skeleton */}
      <div className="h-16 bg-gray-100 rounded-lg"></div>

      {/* Quick Insights skeleton */}
      <div className="h-40 bg-gray-100 rounded-lg"></div>

      {/* KPIs skeleton - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
        ))}
      </div>

      {/* Secondary KPIs skeleton - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
        ))}
      </div>

      {/* Content sections skeleton */}
      <div className="space-y-4 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    </div>
  )
}
