import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import KPICard from '../components/ui/KPICard'
import ChartCard from '../components/ui/ChartCard'
import ChartTooltip from '../components/ui/ChartTooltip'
import DataTable from '../components/ui/DataTable'
import ExportButton from '../components/ui/ExportButton'
import { CHART_COLORS, CARTESIAN_GRID_PROPS, X_AXIS_PROPS, Y_AXIS_PROPS } from '../constants/chartTheme'

import loadData from '../data/load.json'

const latest = loadData.monthly[loadData.monthly.length - 1]
const forecastDelta = ((latest.actual - latest.forecast) / latest.forecast * 100).toFixed(1)

const kpis = [
  { label: 'Current System Load', value: latest.actual.toLocaleString(), unit: 'MW', delta: Number(forecastDelta), deltaSuffix: '% vs fcst', spark: loadData.monthly.slice(-12).map((d) => ({ value: d.actual })), color: CHART_COLORS.green },
  { label: 'Forecasted Peak (This Month)', value: latest.peak.toLocaleString(), unit: 'MW', delta: null, spark: loadData.monthly.slice(-12).map((d) => ({ value: d.peak })), color: CHART_COLORS.blue },
  { label: 'Weather-Adjusted Load', value: (latest.actual * 0.97).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','), unit: 'MW', delta: -3.0, deltaSuffix: '% adj', spark: loadData.monthly.slice(-12).map((d) => ({ value: d.actual * 0.97 })), color: CHART_COLORS.violet },
  { label: 'Forecast MAPE', value: '1.9%', delta: -0.2, deltaSuffix: '%', spark: loadData.monthly.slice(-6).map((d) => ({ value: 100 - Math.abs(d.actual - d.forecast) / d.forecast * 100 })), color: CHART_COLORS.amber },
]

const loadVsForecast = loadData.monthly.map((d) => ({
  period: d.period.slice(2),
  Actual: d.actual,
  Forecast: d.forecast,
}))

const loadDuration = [...loadData.monthly].sort((a, b) => b.actual - a.actual).map((d, i) => ({
  hour: i + 1,
  load: d.actual,
}))

const scatterData = loadData.monthly.map((d) => ({
  temperature: d.temperature,
  load: d.actual,
  period: d.period,
}))

const classTrend = loadData.monthly.map((d) => ({
  period: d.period.slice(2),
  Residential: d.residential,
  Commercial: d.commercial,
  Industrial: d.industrial,
  Other: d.other,
}))

const peakDayChart = loadData.peak_days.map((d) => ({
  date: d.date.slice(5),
  Peak: d.peak,
  Temperature: d.temperature,
}))

const forecastColumns = [
  { key: 'period', label: 'Period' },
  { key: 'forecast', label: 'Forecast MW', align: 'right', render: (v) => v.toLocaleString() },
  { key: 'actual', label: 'Actual MW', align: 'right', render: (v) => v.toLocaleString() },
  { key: 'error', label: 'Error %', align: 'right', render: (v, row) => {
    const color = Math.abs(v) < 1.5 ? 'text-positive' : Math.abs(v) < 3 ? 'text-warning' : 'text-negative'
    return <span className={color}>{v > 0 ? '+' : ''}{v.toFixed(1)}%</span>
  }},
  { key: 'temperature', label: 'Temp °F', align: 'right' },
]

const forecastTable = loadData.monthly.map((d) => ({
  period: d.period,
  forecast: d.forecast,
  actual: d.actual,
  error: (d.actual - d.forecast) / d.forecast * 100,
  temperature: d.temperature,
}))

export default function LoadForecasting() {
  return (
    <>
      {/* KPI Strip */}
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} label={kpi.label} value={kpi.value} unit={kpi.unit} delta={kpi.delta} deltaSuffix={kpi.deltaSuffix} sparklineData={kpi.spark} sparklineColor={kpi.color} span={3} />
      ))}

      {/* Load Forecast vs Actual */}
      <ChartCard title="Load Forecast vs Actual" span={12}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={loadVsForecast}>
              <defs>
                <linearGradient id="gradLoadActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="period" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toLocaleString()} MW`} />} />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Line type="monotone" dataKey="Forecast" stroke={CHART_COLORS.blue} strokeWidth={2} strokeDasharray="6 3" dot={false} />
              <Area type="monotone" dataKey="Actual" stroke={CHART_COLORS.green} strokeWidth={2} fill="url(#gradLoadActual)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Load Duration + Temp Scatter */}
      <ChartCard title="Load Duration Curve" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={loadDuration}>
              <defs>
                <linearGradient id="gradDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="hour" {...X_AXIS_PROPS} label={{ value: 'Months (sorted)', position: 'insideBottom', offset: -5, style: { fontSize: 10, fill: '#64748B' } }} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toLocaleString()} MW`} />} />
              <Area type="monotone" dataKey="load" stroke={CHART_COLORS.green} strokeWidth={2} fill="url(#gradDuration)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Temperature vs Load" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="temperature" type="number" name="Temp" {...X_AXIS_PROPS} unit="°F" />
              <YAxis dataKey="load" type="number" name="Load" {...Y_AXIS_PROPS} unit=" MW" />
              <Tooltip content={<ChartTooltip formatter={(v, name) => name === 'Temp' ? `${v}°F` : `${v.toLocaleString()} MW`} />} />
              <Scatter data={scatterData} fill={CHART_COLORS.blue} fillOpacity={0.7} r={5} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Load by Class + Peak Days */}
      <ChartCard title="Load by Customer Class" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={classTrend}>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="period" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toLocaleString()} MW`} />} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Area type="monotone" dataKey="Other" stackId="1" stroke={CHART_COLORS.amber} fill={CHART_COLORS.amber} fillOpacity={0.4} />
              <Area type="monotone" dataKey="Industrial" stackId="1" stroke={CHART_COLORS.violet} fill={CHART_COLORS.violet} fillOpacity={0.4} />
              <Area type="monotone" dataKey="Commercial" stackId="1" stroke={CHART_COLORS.blue} fill={CHART_COLORS.blue} fillOpacity={0.4} />
              <Area type="monotone" dataKey="Residential" stackId="1" stroke={CHART_COLORS.green} fill={CHART_COLORS.green} fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Top 10 Peak Days" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakDayChart}>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="date" {...X_AXIS_PROPS} />
              <YAxis yAxisId="left" {...Y_AXIS_PROPS} />
              <YAxis yAxisId="right" orientation="right" {...Y_AXIS_PROPS} unit="°F" />
              <Tooltip content={<ChartTooltip formatter={(v, name) => name === 'Temperature' ? `${v}°F` : `${v.toLocaleString()} MW`} />} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Bar yAxisId="left" dataKey="Peak" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="Temperature" stroke={CHART_COLORS.amber} strokeWidth={2} dot={{ r: 3, fill: CHART_COLORS.amber }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Forecast Performance Table */}
      <div className="col-span-12 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Forecast Performance Log</h3>
        <ExportButton data={forecastTable} columns={forecastColumns} filename="forecast-performance.csv" />
      </div>
      <DataTable columns={forecastColumns} data={forecastTable} />
    </>
  )
}
