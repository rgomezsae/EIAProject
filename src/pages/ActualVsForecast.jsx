import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ReferenceLine,
} from 'recharts'
import KPICard from '../components/ui/KPICard'
import ChartCard from '../components/ui/ChartCard'
import ChartTooltip from '../components/ui/ChartTooltip'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import { CHART_COLORS, CARTESIAN_GRID_PROPS, X_AXIS_PROPS, Y_AXIS_PROPS } from '../constants/chartTheme'

import data from '../data/actuals-vs-forecast.json'

const categories = data.categories
const best = [...categories].sort((a, b) => b.accuracy - a.accuracy)[0]
const worst = [...categories].sort((a, b) => a.accuracy - b.accuracy)[0]

const accuracyBars = categories.map((c) => ({
  name: c.name,
  accuracy: c.accuracy,
  fill: c.accuracy >= 97 ? CHART_COLORS.green : c.accuracy >= 94 ? CHART_COLORS.amber : CHART_COLORS.red,
})).sort((a, b) => b.accuracy - a.accuracy)

const trendLines = []
const revCat = categories.find((c) => c.id === 'revenue')
const loadCat = categories.find((c) => c.id === 'load')
if (revCat && loadCat) {
  revCat.monthly.slice(-12).forEach((m, i) => {
    const loadMonth = loadCat.monthly[i + (loadCat.monthly.length - 12)]
    trendLines.push({
      period: m.period.slice(2),
      Revenue: m.accuracy,
      Load: loadMonth?.accuracy || null,
    })
  })
}

const biasData = categories.map((c) => ({
  name: c.name,
  bias: c.biasDirection === 'over' ? c.bias : -c.bias,
}))

function accuracyColor(val) {
  if (val >= 97) return 'text-positive'
  if (val >= 94) return 'text-warning'
  return 'text-negative'
}

const tableColumns = [
  { key: 'category', label: 'Category' },
  { key: 'period', label: 'Period' },
  { key: 'forecast', label: 'Forecast', align: 'right', render: (v) => typeof v === 'number' ? (v >= 100 ? v.toLocaleString() : v.toFixed(2)) : v },
  { key: 'actual', label: 'Actual', align: 'right', render: (v) => typeof v === 'number' ? (v >= 100 ? v.toLocaleString() : v.toFixed(2)) : v },
  { key: 'variance', label: 'Variance', align: 'right', render: (v) => <span className={v >= 0 ? 'text-positive' : 'text-negative'}>{v >= 0 ? '+' : ''}{typeof v === 'number' ? (Math.abs(v) >= 1 ? v.toFixed(1) : v.toFixed(2)) : v}</span> },
  { key: 'accuracy', label: 'Accuracy %', align: 'right', render: (v) => <span className={accuracyColor(v)}>{v.toFixed(1)}%</span> },
  { key: 'biasDir', label: 'Bias', render: (v) => <Badge variant={v === 'over' ? 'positive' : 'negative'}>{v === 'over' ? 'Over' : 'Under'}</Badge> },
]

const tableData = categories.flatMap((cat) =>
  cat.monthly.map((m) => ({
    category: cat.name,
    period: m.period,
    forecast: m.forecast,
    actual: m.actual,
    variance: m.actual - m.forecast,
    accuracy: m.accuracy,
    biasDir: cat.biasDirection,
  }))
)

export default function ActualVsForecast() {
  return (
    <>
      {/* KPI Strip */}
      <KPICard label="Overall Forecast Accuracy" value={`${data.compositeAccuracy}%`} delta={0.8} deltaSuffix="% QoQ" sparklineData={null} sparklineColor={CHART_COLORS.green} span={4} />
      <KPICard label="Best Performing Category" value={best.name} unit={`${best.accuracy}%`} delta={null} sparklineData={null} sparklineColor={CHART_COLORS.green} span={4} />
      <KPICard label="Worst Performing Category" value={worst.name} unit={`${worst.accuracy}%`} delta={null} sparklineData={null} sparklineColor={CHART_COLORS.red} span={4} />

      {/* Accuracy by Category */}
      <ChartCard title="Forecast Accuracy by Category" span={12}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accuracyBars} layout="vertical">
              <CartesianGrid {...CARTESIAN_GRID_PROPS} horizontal={false} vertical />
              <XAxis type="number" domain={[85, 100]} {...X_AXIS_PROPS} />
              <YAxis type="category" dataKey="name" {...Y_AXIS_PROPS} width={120} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toFixed(1)}%`} />} />
              <ReferenceLine x={95} stroke={CHART_COLORS.amber} strokeDasharray="4 4" label={{ value: 'Target 95%', position: 'top', style: { fontSize: 10, fill: CHART_COLORS.amber } }} />
              <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={28}>
                {accuracyBars.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Accuracy Trend + Bias Analysis */}
      <ChartCard title="Accuracy Trend Over Time" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendLines}>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="period" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} domain={[95, 100]} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toFixed(1)}%`} />} />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Line type="monotone" dataKey="Revenue" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Load" stroke={CHART_COLORS.blue} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Bias Analysis" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={biasData} layout="vertical">
              <CartesianGrid {...CARTESIAN_GRID_PROPS} horizontal={false} vertical />
              <XAxis type="number" {...X_AXIS_PROPS} domain={[-5, 5]} />
              <YAxis type="category" dataKey="name" {...Y_AXIS_PROPS} width={120} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`} />} />
              <ReferenceLine x={0} stroke="#64748B" />
              <Bar dataKey="bias" barSize={28} radius={[4, 4, 4, 4]}>
                {biasData.map((entry, i) => (
                  <Cell key={i} fill={entry.bias >= 0 ? CHART_COLORS.green : CHART_COLORS.red} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Variance Detail Table */}
      <div className="col-span-12">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Variance Detail</h3>
      </div>
      <DataTable columns={tableColumns} data={tableData} />
    </>
  )
}
