export function SkeletonBlock({ className = '', width, height }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-surface-700 via-surface-800 to-surface-700 bg-[length:200%_100%] ${className}`}
      style={{ width, height }}
    />
  )
}

export function KPICardSkeleton({ span = 2 }) {
  return (
    <div
      className="bg-surface-800 border border-surface-600 rounded-xl p-5 flex flex-col gap-3"
      style={{ gridColumn: `span ${span}` }}
    >
      <div className="flex justify-between">
        <SkeletonBlock width="60%" height="28px" />
        <SkeletonBlock width="50px" height="22px" />
      </div>
      <SkeletonBlock width="100%" height="40px" />
      <SkeletonBlock width="40%" height="14px" />
    </div>
  )
}

export function ChartCardSkeleton({ span = 6, height = 'h-64' }) {
  return (
    <div
      className="bg-surface-800 border border-surface-600 rounded-xl p-6 flex flex-col"
      style={{ gridColumn: `span ${span}` }}
    >
      <SkeletonBlock width="40%" height="16px" className="mb-4" />
      <SkeletonBlock width="100%" className={`${height} rounded-lg`} />
    </div>
  )
}

export function TableSkeleton({ rows = 5, span = 12 }) {
  return (
    <div
      className="bg-surface-800 border border-surface-600 rounded-xl overflow-hidden"
      style={{ gridColumn: `span ${span}` }}
    >
      <div className="px-4 py-3 border-b border-surface-600">
        <SkeletonBlock width="100%" height="16px" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-surface-600/50 flex gap-4">
          <SkeletonBlock width="20%" height="14px" />
          <SkeletonBlock width="15%" height="14px" />
          <SkeletonBlock width="25%" height="14px" />
          <SkeletonBlock width="15%" height="14px" />
        </div>
      ))}
    </div>
  )
}
