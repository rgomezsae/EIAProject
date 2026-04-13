import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import KPICard from '../components/ui/KPICard'
import ChartCard from '../components/ui/ChartCard'
import ChartTooltip from '../components/ui/ChartTooltip'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import { CHART_COLORS, CARTESIAN_GRID_PROPS, X_AXIS_PROPS, Y_AXIS_PROPS } from '../constants/chartTheme'

import peersData from '../data/peers.json'

const { rankings, peerGroup, radarDimensions, quarterly } = peersData

const radarData = radarDimensions.map((d) => ({
  dimension: d.dimension,
  Utility: d.utility,
  'Peer Avg': d.peerAvg,
}))

const rateRanking = [...peerGroup].sort((a, b) => a.avgRate - b.avgRate).map((p) => ({
  name: p.name,
  rate: p.avgRate,
  highlight: p.highlight,
}))

const nationalAvg = peerGroup.reduce((sum, p) => sum + p.avgRate, 0) / peerGroup.length

const trendData = quarterly.map((q) => ({
  quarter: q.quarter.replace('20', "'"),
  Utility: q.utilityScore,
  'Peer Avg': q.peerAvgScore,
}))

const tableColumns = [
  { key: 'name', label: 'Utility', render: (v, row) => (
    <span className={row.highlight ? 'text-nex-green font-semibold' : ''}>{v}</span>
  )},
  { key: 'avgRate', label: 'Avg Rate ¢/kWh', align: 'right', render: (v) => v.toFixed(2) },
  { key: 'loadGrowth', label: 'Load Growth %', align: 'right', render: (v) => <span className={v > 2 ? 'text-positive' : 'text-text-primary'}>{v.toFixed(1)}%</span> },
  { key: 'revenueGrowth', label: 'Rev Growth %', align: 'right', render: (v) => <span className={v > 3 ? 'text-positive' : 'text-text-primary'}>{v.toFixed(1)}%</span> },
  { key: 'saidi', label: 'SAIDI', align: 'right' },
  { key: 'caidi', label: 'CAIDI', align: 'right' },
  { key: 'customerSat', label: 'Cust Sat', align: 'right', render: (v) => v.toFixed(1) },
  { key: 'renewablePct', label: 'Renewable %', align: 'right', render: (v) => `${v}%` },
]

export default function PeerComparison() {
  return (
    <>
      {/* KPI Strip */}
      <KPICard label="Peer Rank (Overall)" value={`#${rankings.overall.rank} of ${rankings.overall.total}`} delta={rankings.overall.change} deltaSuffix=" spot" sparklineData={quarterly.slice(-4).map((d) => ({ value: d.utilityScore }))} sparklineColor={CHART_COLORS.green} span={3} />
      <KPICard label="Rate Percentile" value={`${rankings.ratePercentile}th`} unit="percentile" delta={null} sparklineData={null} sparklineColor={CHART_COLORS.blue} span={3} />
      <KPICard label="Reliability Rank" value={`#${rankings.reliabilityRank.rank} of ${rankings.reliabilityRank.total}`} delta={null} sparklineData={null} sparklineColor={CHART_COLORS.violet} span={3} />
      <KPICard label="Customer Satisfaction" value={`#${rankings.customerSatRank.rank} of ${rankings.customerSatRank.total}`} delta={null} sparklineData={null} sparklineColor={CHART_COLORS.amber} span={3} />

      {/* Peer Scorecard Radar */}
      <ChartCard title="Peer Scorecard — Radar Chart" span={12}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar name="Utility" dataKey="Utility" stroke={CHART_COLORS.green} fill={CHART_COLORS.green} fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Peer Avg" dataKey="Peer Avg" stroke={CHART_COLORS.blue} fill={CHART_COLORS.blue} fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Rate Ranking + Performance Trend */}
      <ChartCard title="Rate Ranking vs Peers" span={6}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rateRanking} layout="vertical">
              <CartesianGrid {...CARTESIAN_GRID_PROPS} horizontal={false} vertical />
              <XAxis type="number" {...X_AXIS_PROPS} domain={[0, 'auto']} />
              <YAxis type="category" dataKey="name" {...Y_AXIS_PROPS} width={130} tick={{ fontSize: 11 }} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toFixed(2)}¢/kWh`} />} />
              <Bar dataKey="rate" barSize={18} radius={[0, 4, 4, 0]}>
                {rateRanking.map((entry, i) => (
                  <Cell key={i} fill={entry.highlight ? CHART_COLORS.green : '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Performance Trend vs Peers" span={6}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradPeerUtil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="quarter" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} domain={[60, 95]} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v} pts`} />} />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Area type="monotone" dataKey="Utility" stroke={CHART_COLORS.green} strokeWidth={2} fill="url(#gradPeerUtil)" />
              <Line type="monotone" dataKey="Peer Avg" stroke={CHART_COLORS.blue} strokeWidth={2} strokeDasharray="6 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Peer Comparison Matrix */}
      <div className="col-span-12">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Peer Comparison Matrix</h3>
      </div>
      <DataTable columns={tableColumns} data={peerGroup} />
    </>
  )
}
