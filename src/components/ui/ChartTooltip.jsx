export default function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-surface-700/90 backdrop-blur-md border border-surface-600 rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-text-muted mb-1 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="text-text-primary font-medium font-mono ml-auto">
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}
