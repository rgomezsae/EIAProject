import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import KPICard from '../components/ui/KPICard'
import ChartCard from '../components/ui/ChartCard'
import ChartTooltip from '../components/ui/ChartTooltip'
import DataTable from '../components/ui/DataTable'
import ExportButton from '../components/ui/ExportButton'
import { CHART_COLORS, CARTESIAN_GRID_PROPS, X_AXIS_PROPS, Y_AXIS_PROPS } from '../constants/chartTheme'

import revenueData from '../data/revenue.json'
import peersData from '../data/peers.json'

const months = revenueData.monthly
const latest = months[months.length - 1]
const ytdActual = months.filter((d) => d.period.startsWith('2025')).reduce((sum, d) => sum + d.actual, 0)
const ytdBudget = months.filter((d) => d.period.startsWith('2025')).reduce((sum, d) => sum + d.budget, 0)
const ytdDelta = ((ytdActual - ytdBudget) / ytdBudget * 100).toFixed(1)
const fullYearForecast = months.filter((d) => d.period.startsWith('2025')).reduce((sum, d) => sum + d.forecast, 0)
const fullYearBudget = months.filter((d) => d.period.startsWith('2025')).reduce((sum, d) => sum + d.budget, 0)

const kpis = [
  { label: 'Revenue YTD', value: `$${(ytdActual / 1000).toFixed(1)}`, unit: 'B', delta: Number(ytdDelta), deltaSuffix: '% vs budget', spark: months.slice(-12).map((d) => ({ value: d.actual })), color: CHART_COLORS.green },
  { label: 'Revenue Forecast (Full Year)', value: `$${(fullYearForecast / 1000).toFixed(1)}`, unit: 'B', delta: Number(((fullYearForecast - fullYearBudget) / fullYearBudget * 100).toFixed(1)), deltaSuffix: '% vs plan', spark: months.slice(-12).map((d) => ({ value: d.forecast })), color: CHART_COLORS.blue },
  { label: 'Revenue Per MWh', value: `$${latest.perMWh.toFixed(1)}`, unit: '/MWh', delta: 2.2, deltaSuffix: '% YoY', spark: months.slice(-12).map((d) => ({ value: d.perMWh })), color: CHART_COLORS.violet },
  { label: 'Unbilled Revenue', value: `$${revenueData.unbilledRevenue}`, unit: 'M', delta: null, spark: null, color: CHART_COLORS.amber },
]

const revChart = months.map((d) => ({
  period: d.period.slice(2),
  Actual: d.actual,
  Forecast: d.forecast,
  Budget: d.budget,
}))

const classChart = months.slice(-12).map((d) => ({
  period: d.period.slice(5),
  Residential: d.residential,
  Commercial: d.commercial,
  Industrial: d.industrial,
  Other: d.other,
}))

const waterfall = revenueData.varianceWaterfall
const waterfallChart = waterfall.map((item, i) => {
  if (i === 0 || i === waterfall.length - 1) {
    return { name: item.name, value: item.value, base: 0, fill: CHART_COLORS.blue }
  }
  const base = waterfall.slice(1, i).reduce((sum, w) => sum + w.value, waterfall[0].value)
  return {
    name: item.name,
    value: Math.abs(item.value),
    base: item.value >= 0 ? base : base + item.value,
    fill: item.value >= 0 ? CHART_COLORS.green : CHART_COLORS.red,
  }
})

const perMwhTrend = months.map((d) => ({
  period: d.period.slice(2),
  Utility: d.perMWh,
  'Peer Avg': 40.5 + Math.random() * 2,
}))

const heatmapData = []
for (let year = 2024; year <= 2025; year++) {
  for (let m = 1; m <= 12; m++) {
    const entry = months.find((d) => d.period === `${year}-${String(m).padStart(2, '0')}`)
    if (entry) heatmapData.push({ year, month: m, revenue: entry.actual })
  }
}

const tableColumns = [
  { key: 'period', label: 'Month' },
  { key: 'budget', label: 'Budget $M', align: 'right', render: (v) => `$${v.toFixed(1)}` },
  { key: 'forecast', label: 'Forecast $M', align: 'right', render: (v) => `$${v.toFixed(1)}` },
  { key: 'actual', label: 'Actual $M', align: 'right', render: (v) => `$${v.toFixed(1)}` },
  { key: 'variance', label: 'Variance $', align: 'right', render: (v) => <span className={v >= 0 ? 'text-positive' : 'text-negative'}>{v >= 0 ? '+' : ''}${v.toFixed(1)}M</span> },
  { key: 'variancePct', label: 'Variance %', align: 'right', render: (v) => <span className={v >= 0 ? 'text-positive' : 'text-negative'}>{v >= 0 ? '+' : ''}{v.toFixed(1)}%</span> },
]

const tableData = months.map((d) => ({
  period: d.period,
  budget: d.budget,
  forecast: d.forecast,
  actual: d.actual,
  variance: d.actual - d.budget,
  variancePct: (d.actual - d.budget) / d.budget * 100,
}))

export default function RevenueForecasting() {
  return (
    <>
      {/* KPI Strip */}
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} label={kpi.label} value={kpi.value} unit={kpi.unit} delta={kpi.delta} deltaSuffix={kpi.deltaSuffix} sparklineData={kpi.spark} sparklineColor={kpi.color} span={3} />
      ))}

      {/* Revenue Actual vs Forecast vs Budget */}
      <ChartCard title="Revenue — Actual vs Forecast vs Budget" span={12}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revChart}>
              <defs>
                <linearGradient id="gradRevActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="period" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `$${v.toFixed(1)}M`} />} />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Line type="monotone" dataKey="Budget" stroke="#64748B" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="Forecast" stroke={CHART_COLORS.blue} strokeWidth={2} strokeDasharray="6 3" dot={false} />
              <Area type="monotone" dataKey="Actual" stroke={CHART_COLORS.green} strokeWidth={2} fill="url(#gradRevActual)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Revenue by Class + Waterfall */}
      <ChartCard title="Revenue by Customer Class (Last 12 Months)" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classChart}>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="period" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `$${v.toFixed(1)}M`} />} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Bar dataKey="Residential" stackId="a" fill={CHART_COLORS.green} />
              <Bar dataKey="Commercial" stackId="a" fill={CHART_COLORS.blue} />
              <Bar dataKey="Industrial" stackId="a" fill={CHART_COLORS.violet} />
              <Bar dataKey="Other" stackId="a" fill={CHART_COLORS.amber} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Revenue Variance Waterfall" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallChart}>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="name" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} domain={[0, 'auto']} />
              <Tooltip content={<ChartTooltip formatter={(v) => `$${v.toFixed(1)}M`} />} />
              <Bar dataKey="base" stackId="a" fill="transparent" />
              <Bar dataKey="value" stackId="a" radius={[4, 4, 0, 0]}>
                {waterfallChart.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Rev per MWh + Heatmap */}
      <ChartCard title="Revenue per MWh Trend" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={perMwhTrend}>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="period" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip content={<ChartTooltip formatter={(v) => `$${v.toFixed(1)}/MWh`} />} />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Line type="monotone" dataKey="Utility" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Peer Avg" stroke={CHART_COLORS.blue} strokeWidth={2} strokeDasharray="6 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Seasonal Revenue Heatmap" span={6}>
        <div className="h-64 flex flex-col justify-center px-2">
          <div className="flex gap-1 mb-2">
            <div className="w-10" />
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="flex-1 text-center text-[10px] text-text-muted">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
              </div>
            ))}
          </div>
          {[2024, 2025].map((year) => (
            <div key={year} className="flex gap-1 mb-1">
              <div className="w-10 text-[10px] text-text-muted flex items-center">{year}</div>
              {Array.from({ length: 12 }, (_, m) => {
                const entry = heatmapData.find((d) => d.year === year && d.month === m + 1)
                const rev = entry?.revenue || 0
                const maxRev = Math.max(...heatmapData.map((d) => d.revenue))
                const minRev = Math.min(...heatmapData.map((d) => d.revenue))
                const intensity = (rev - minRev) / (maxRev - minRev)
                return (
                  <div
                    key={m}
                    className="flex-1 h-10 rounded-sm flex items-center justify-center text-[9px] font-mono"
                    style={{
                      backgroundColor: rev ? `rgba(120, 194, 57, ${0.15 + intensity * 0.7})` : 'var(--surface-700)',
                      color: intensity > 0.5 ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                    title={entry ? `$${rev.toFixed(1)}M` : ''}
                  >
                    {rev ? `${rev.toFixed(0)}` : ''}
                  </div>
                )
              })}
            </div>
          ))}
          <div className="flex items-center gap-2 mt-3 justify-center">
            <span className="text-[10px] text-text-muted">Low</span>
            <div className="flex gap-0.5">
              {[0.15, 0.3, 0.5, 0.7, 0.85].map((op) => (
                <div key={op} className="w-6 h-3 rounded-sm" style={{ backgroundColor: `rgba(120, 194, 57, ${op})` }} />
              ))}
            </div>
            <span className="text-[10px] text-text-muted">High</span>
          </div>
        </div>
      </ChartCard>

      {/* Revenue Detail Table */}
      <div className="col-span-12 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Revenue Detail</h3>
        <ExportButton data={tableData} columns={tableColumns} filename="revenue-detail.csv" />
      </div>
      <DataTable columns={tableColumns} data={tableData} />
    </>
  )
}
