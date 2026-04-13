import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts'
import KPICard from '../components/ui/KPICard'
import ChartCard from '../components/ui/ChartCard'
import ChartTooltip from '../components/ui/ChartTooltip'
import Badge from '../components/ui/Badge'
import { useNavigation } from '../hooks/useNavigation'
import { useDrillDown } from '../hooks/useDrillDown'
import { CHART_COLORS, CARTESIAN_GRID_PROPS, X_AXIS_PROPS, Y_AXIS_PROPS } from '../constants/chartTheme'

import ratesData from '../data/rates.json'
import loadData from '../data/load.json'
import revenueData from '../data/revenue.json'
import forecastData from '../data/actuals-vs-forecast.json'
import peersData from '../data/peers.json'
import dcData from '../data/datacenters.json'
import alertsData from '../data/alerts.json'

const latestRate = ratesData.monthly[ratesData.monthly.length - 1]
const prevYearRate = ratesData.monthly[ratesData.monthly.length - 13]
const rateDelta = ((latestRate.average - prevYearRate.average) / prevYearRate.average * 100).toFixed(1)
const rateSparkline = ratesData.monthly.slice(-12).map((d) => ({ value: d.average }))

const latestLoad = loadData.monthly[loadData.monthly.length - 1]
const loadForecastDelta = ((latestLoad.actual - latestLoad.forecast) / latestLoad.forecast * 100).toFixed(1)
const loadSparkline = loadData.monthly.slice(-12).map((d) => ({ value: d.peak }))

const latestRevenue = revenueData.monthly[revenueData.monthly.length - 1]
const revBudgetDelta = ((latestRevenue.actual - latestRevenue.budget) / latestRevenue.budget * 100).toFixed(1)
const revSparkline = revenueData.monthly.slice(-12).map((d) => ({ value: d.actual }))

const accuracySparkline = forecastData.categories[0].monthly.slice(-6).map((d) => ({ value: d.accuracy }))
const prevAccuracy = forecastData.categories[0].monthly.slice(-7, -6)[0]?.accuracy || 97
const accDelta = (forecastData.compositeAccuracy - prevAccuracy).toFixed(1)

const peerRank = peersData.rankings.overall
const peerSparkline = peersData.quarterly.slice(-4).map((d) => ({ value: d.utilityScore }))

const dcLoad = dcData.summary.totalLoad
const dcSparkline = dcData.quarterly_load.map((d) => ({ value: d.active }))

const revenueChart = revenueData.monthly.slice(-12).map((d) => ({
  period: d.period.slice(5),
  Actual: d.actual,
  Forecast: d.forecast,
}))

const rateComponents = latestRate.components
const rateComponentData = [
  { name: 'Base', value: rateComponents.base },
  { name: 'Fuel', value: rateComponents.fuel },
  { name: 'Riders', value: rateComponents.riders },
  { name: 'Taxes', value: rateComponents.taxes },
]

const loadForecast7d = loadData.daily_forecast.map((d) => ({
  date: d.date.slice(5),
  Forecast: d.forecast,
  Low: d.low,
  High: d.high,
  Actual: d.actual,
}))

const radarData = peersData.radarDimensions.map((d) => ({
  dimension: d.dimension,
  Utility: d.utility,
  'Peer Avg': d.peerAvg,
}))

export default function ExecutiveSummary() {
  const { navigateTo } = useNavigation()
  const { openDrillDown } = useDrillDown()

  function drillRevenue() {
    openDrillDown('Revenue vs Forecast Detail', (
      <div className="space-y-3">
        {revenueChart.map((d) => (
          <div key={d.period} className="flex justify-between items-center py-2 border-b border-surface-600/50">
            <span className="text-text-secondary text-sm">{d.period}</span>
            <div className="flex gap-6">
              <span className="text-sm font-mono text-nex-green">${d.Actual.toFixed(1)}M</span>
              <span className="text-sm font-mono text-nex-blue">${d.Forecast.toFixed(1)}M</span>
              <span className={`text-sm font-mono ${d.Actual >= d.Forecast ? 'text-positive' : 'text-negative'}`}>
                {d.Actual >= d.Forecast ? '+' : ''}{(d.Actual - d.Forecast).toFixed(1)}M
              </span>
            </div>
          </div>
        ))}
      </div>
    ))
  }

  return (
    <>
      {/* Row 1 — KPI Strip */}
      <KPICard label="Avg Retail Rate" value={latestRate.average.toFixed(2)} unit="¢/kWh" delta={Number(rateDelta)} deltaSuffix="% YoY" sparklineData={rateSparkline} sparklineColor={CHART_COLORS.green} />
      <KPICard label="System Peak Load" value={latestLoad.peak.toLocaleString()} unit="MW" delta={Number(loadForecastDelta)} deltaSuffix="% vs fcst" sparklineData={loadSparkline} sparklineColor={CHART_COLORS.blue} />
      <KPICard label="Revenue MTD" value={`$${latestRevenue.actual.toFixed(1)}`} unit="M" delta={Number(revBudgetDelta)} deltaSuffix="% vs budget" sparklineData={revSparkline} sparklineColor={CHART_COLORS.green} />
      <KPICard label="Forecast Accuracy" value={`${forecastData.compositeAccuracy}%`} delta={Number(accDelta)} deltaSuffix="%" sparklineData={accuracySparkline} sparklineColor={CHART_COLORS.violet} />
      <KPICard label="Peer Rank" value={`#${peerRank.rank} of ${peerRank.total}`} delta={peerRank.change} deltaSuffix=" spot" sparklineData={peerSparkline} sparklineColor={CHART_COLORS.amber} />
      <KPICard label="Data Center Load" value={dcLoad.toLocaleString()} unit="MW" delta={Number(dcData.summary.systemLoadPct.toFixed(1))} deltaSuffix="% of sys" sparklineData={dcSparkline} sparklineColor={CHART_COLORS.pink} />

      {/* Row 2 — Revenue vs Forecast + Rate Composition */}
      <ChartCard title="Revenue vs Forecast (Last 12 Months)" span={8} onDrillDown={drillRevenue} exportData={revenueChart} exportColumns={[{key:'period',label:'Month'},{key:'Actual',label:'Actual $M'},{key:'Forecast',label:'Forecast $M'}]} exportFilename="revenue-vs-forecast.csv">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChart}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="period" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `$${v.toFixed(1)}M`} />} />
              <Area type="monotone" dataKey="Forecast" stroke={CHART_COLORS.blue} strokeWidth={2} strokeDasharray="6 3" fill="url(#gradForecast)" />
              <Area type="monotone" dataKey="Actual" stroke={CHART_COLORS.green} strokeWidth={2} fill="url(#gradActual)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Rate Composition (Current)" span={4}>
        <div className="h-64 flex flex-col justify-center gap-3 px-2">
          {rateComponentData.map((item, i) => {
            const colors = [CHART_COLORS.green, CHART_COLORS.blue, CHART_COLORS.violet, CHART_COLORS.amber]
            const maxVal = Math.max(...rateComponentData.map((d) => d.value))
            return (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-12 text-right">{item.name}</span>
                <div className="flex-1 bg-surface-700 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.value / maxVal) * 100}%`, backgroundColor: colors[i] }}
                  />
                </div>
                <span className="text-xs font-mono text-text-primary w-14">{item.value.toFixed(2)}¢</span>
              </div>
            )
          })}
        </div>
      </ChartCard>

      {/* Row 3 — Load Forecast + Peer Radar */}
      <ChartCard title="Load Forecast — Next 7 Days" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={loadForecast7d}>
              <defs>
                <linearGradient id="gradConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="date" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} domain={['dataMin - 200', 'dataMax + 200']} />
              <Tooltip content={<ChartTooltip formatter={(v) => v ? `${v.toLocaleString()} MW` : 'N/A'} />} />
              <Area type="monotone" dataKey="High" stroke="none" fill="url(#gradConfidence)" />
              <Area type="monotone" dataKey="Low" stroke="none" fill="var(--surface-800)" />
              <Line type="monotone" dataKey="Forecast" stroke={CHART_COLORS.blue} strokeWidth={2} strokeDasharray="6 3" dot={false} />
              <Line type="monotone" dataKey="Actual" stroke={CHART_COLORS.green} strokeWidth={2} dot={{ r: 4, fill: CHART_COLORS.green }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Peer Comparison — Key Metrics" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Utility" dataKey="Utility" stroke={CHART_COLORS.green} fill={CHART_COLORS.green} fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Peer Avg" dataKey="Peer Avg" stroke={CHART_COLORS.blue} fill={CHART_COLORS.blue} fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Row 4 — Alerts & Insights */}
      <div className="col-span-12 bg-surface-800 border border-surface-600 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-600">
          <h3 className="text-sm font-semibold text-text-primary">Alerts & Insights</h3>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {alertsData.alerts.map((alert) => (
              <tr
                key={alert.id}
                onClick={() => navigateTo(alert.page)}
                className="border-b border-surface-600/50 last:border-0 hover:bg-surface-700/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 w-8">
                  <span className={`block w-2.5 h-2.5 rounded-full ${
                    alert.severity === 'positive' ? 'bg-positive' :
                    alert.severity === 'negative' ? 'bg-negative' : 'bg-warning'
                  }`} />
                </td>
                <td className="px-2 py-3 w-28">
                  <Badge variant={alert.severity === 'positive' ? 'positive' : alert.severity === 'negative' ? 'negative' : 'warning'}>
                    {alert.category}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-text-primary">{alert.text}</td>
                <td className="px-4 py-3 text-right font-mono text-xs whitespace-nowrap">
                  <span className={alert.trend > 0 ? 'text-positive' : 'text-negative'}>
                    {alert.trend > 0 ? '▲' : '▼'} {Math.abs(alert.trend)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
