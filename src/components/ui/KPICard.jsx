import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

function DeltaBadge({ value, suffix = '%' }) {
  if (value == null) return null

  const isPositive = value > 0
  const isNeutral = value === 0
  const color = isPositive ? 'text-positive' : isNeutral ? 'text-text-muted' : 'text-negative'
  const bgColor = isPositive ? 'bg-positive/15' : isNeutral ? 'bg-surface-600/50' : 'bg-negative/15'
  const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${color} ${bgColor}`}>
      <Icon size={12} strokeWidth={2} />
      {isPositive && '+'}{value}{suffix}
    </span>
  )
}

function Sparkline({ data, color = 'var(--nex-green)' }) {
  if (!data || data.length === 0) return null

  return (
    <div className="h-10 w-full mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`sparkGrad-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sparkGrad-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function KPICard({ label, value, unit, delta, deltaSuffix, sparklineData, sparklineColor, span = 2 }) {
  return (
    <div
      className="bg-surface-800 border border-surface-600 rounded-xl p-5 flex flex-col"
      style={{ gridColumn: `span ${span}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-2xl font-bold font-mono text-text-primary leading-tight">
          {value}
          {unit && <span className="text-sm font-normal text-text-muted ml-1">{unit}</span>}
        </p>
        <DeltaBadge value={delta} suffix={deltaSuffix} />
      </div>

      <Sparkline data={sparklineData} color={sparklineColor} />

      <p className="text-xs text-text-secondary mt-auto pt-2 uppercase tracking-wider">
        {label}
      </p>
    </div>
  )
}
