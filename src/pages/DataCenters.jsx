import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import KPICard from '../components/ui/KPICard'
import ChartCard from '../components/ui/ChartCard'
import ChartTooltip from '../components/ui/ChartTooltip'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import ExportButton from '../components/ui/ExportButton'
import { CHART_COLORS, CARTESIAN_GRID_PROPS, X_AXIS_PROPS, Y_AXIS_PROPS } from '../constants/chartTheme'

import dcData from '../data/datacenters.json'

const { summary, facilities, quarterly_load, projections } = dcData

const kpis = [
  { label: 'Active Data Center Customers', value: summary.activeCustomers.toString(), delta: summary.customerGrowth, deltaSuffix: ' new', spark: quarterly_load.map((d) => ({ value: d.active })), color: CHART_COLORS.green },
  { label: 'Total Data Center Load', value: summary.totalLoad.toLocaleString(), unit: 'MW', delta: summary.systemLoadPct, deltaSuffix: '% of sys', spark: quarterly_load.map((d) => ({ value: d.active })), color: CHART_COLORS.blue },
  { label: 'Data Center Revenue', value: `$${summary.revenue}`, unit: 'M', delta: summary.revenueYoY, deltaSuffix: '% YoY', spark: null, color: CHART_COLORS.violet },
  { label: 'Pipeline / Queued Load', value: summary.pipelineLoad.toLocaleString(), unit: 'MW', delta: null, spark: null, color: CHART_COLORS.amber },
]

const loadGrowth = quarterly_load.map((d) => ({
  quarter: d.quarter.replace('20', "'"),
  Active: d.active,
  Construction: d.construction,
  Pipeline: d.pipeline,
  '% of System': d.systemPct,
}))

const totalRevenue = 2430
const donutData = [
  { name: 'Data Centers', value: summary.revenue },
  { name: 'Rest of System', value: totalRevenue - summary.revenue },
]

const activeFacilities = facilities.filter((f) => f.status === 'active')
const capacityVsDemand = activeFacilities.slice(0, 8).map((f) => ({
  name: f.name.length > 15 ? f.name.slice(0, 15) + '...' : f.name,
  Contracted: f.contractedMW,
  'Peak Demand': f.peakMW,
}))

const projChart = projections.map((p) => ({
  year: p.year.toString(),
  Base: p.base,
  High: p.high,
  Low: p.low,
}))

const statusColor = (status) => {
  if (status === 'active') return 'positive'
  if (status === 'construction') return 'warning'
  return 'info'
}

const tableColumns = [
  { key: 'name', label: 'Facility Name' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status', render: (v) => <Badge variant={statusColor(v)}>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge> },
  { key: 'contractedMW', label: 'Contracted MW', align: 'right' },
  { key: 'peakMW', label: 'Peak MW', align: 'right', render: (v) => v ?? '—' },
  { key: 'utilization', label: 'Util %', align: 'right', render: (v) => v ? <span className={v >= 90 ? 'text-positive' : v >= 80 ? 'text-warning' : 'text-text-primary'}>{v}%</span> : '—' },
  { key: 'revenue', label: 'Revenue $M', align: 'right', render: (v) => v ? `$${v.toFixed(1)}` : '—' },
  { key: 'onlineDate', label: 'Online Date' },
]

export default function DataCenters() {
  return (
    <>
      {/* KPI Strip */}
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} label={kpi.label} value={kpi.value} unit={kpi.unit} delta={kpi.delta} deltaSuffix={kpi.deltaSuffix} sparklineData={kpi.spark} sparklineColor={kpi.color} span={3} />
      ))}

      {/* Load Growth Combo Chart */}
      <ChartCard title="Data Center Load Growth" span={12}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={loadGrowth}>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="quarter" {...X_AXIS_PROPS} />
              <YAxis yAxisId="left" {...Y_AXIS_PROPS} />
              <YAxis yAxisId="right" orientation="right" {...Y_AXIS_PROPS} unit="%" />
              <Tooltip content={<ChartTooltip formatter={(v, name) => name === '% of System' ? `${v}%` : `${v} MW`} />} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Bar yAxisId="left" dataKey="Active" stackId="a" fill={CHART_COLORS.green} />
              <Bar yAxisId="left" dataKey="Construction" stackId="a" fill={CHART_COLORS.amber} />
              <Bar yAxisId="left" dataKey="Pipeline" stackId="a" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="% of System" stroke={CHART_COLORS.pink} strokeWidth={2} dot={{ r: 3, fill: CHART_COLORS.pink }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Revenue Donut + Capacity vs Demand */}
      <ChartCard title="Revenue Contribution" span={6}>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%" cy="50%"
                innerRadius={65} outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                startAngle={90} endAngle={-270}
              >
                <Cell fill={CHART_COLORS.green} />
                <Cell fill="#334155" />
              </Pie>
              <Tooltip content={<ChartTooltip formatter={(v) => `$${v.toFixed(1)}M`} />} />
              <text x="50%" y="46%" textAnchor="middle" fill="var(--text-primary)" fontSize={22} fontWeight={700} fontFamily="'JetBrains Mono', monospace">
                ${summary.revenue}M
              </text>
              <text x="50%" y="58%" textAnchor="middle" fill="var(--text-muted)" fontSize={11}>
                {(summary.revenue / totalRevenue * 100).toFixed(1)}% of total
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Capacity vs Peak Demand" span={6}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={capacityVsDemand} layout="vertical">
              <CartesianGrid {...CARTESIAN_GRID_PROPS} horizontal={false} vertical />
              <XAxis type="number" {...X_AXIS_PROPS} unit=" MW" />
              <YAxis type="category" dataKey="name" {...Y_AXIS_PROPS} width={130} tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v} MW`} />} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Bar dataKey="Contracted" fill={CHART_COLORS.blue} radius={[0, 4, 4, 0]} barSize={12} />
              <Bar dataKey="Peak Demand" fill={CHART_COLORS.green} radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Growth Projections */}
      <ChartCard title="Growth Projections (5-Year)" span={12}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projChart}>
              <defs>
                <linearGradient id="gradProjBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="year" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toLocaleString()} MW`} />} />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Line type="monotone" dataKey="High" stroke={CHART_COLORS.green} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Area type="monotone" dataKey="Base" stroke={CHART_COLORS.green} strokeWidth={2} fill="url(#gradProjBase)" />
              <Line type="monotone" dataKey="Low" stroke={CHART_COLORS.amber} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Portfolio Table */}
      <div className="col-span-12 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Data Center Portfolio</h3>
        <ExportButton data={facilities} columns={tableColumns} filename="datacenter-portfolio.csv" />
      </div>
      <DataTable columns={tableColumns} data={facilities} />
    </>
  )
}
