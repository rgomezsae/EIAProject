import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import KPICard from '../components/ui/KPICard'
import ChartCard from '../components/ui/ChartCard'
import ChartTooltip from '../components/ui/ChartTooltip'
import DataTable from '../components/ui/DataTable'
import SegmentedControl from '../components/ui/SegmentedControl'
import FilterBar from '../components/ui/FilterBar'
import ExportButton from '../components/ui/ExportButton'
import { CHART_COLORS, CARTESIAN_GRID_PROPS, X_AXIS_PROPS, Y_AXIS_PROPS } from '../constants/chartTheme'

import ratesData from '../data/rates.json'

const latest = ratesData.monthly[ratesData.monthly.length - 1]
const prevYear = ratesData.monthly[ratesData.monthly.length - 13]

function yoyDelta(current, prior) {
  return ((current - prior) / prior * 100).toFixed(1)
}

const kpis = [
  { label: 'Current Avg Retail Rate', value: latest.average.toFixed(2), unit: '¢/kWh', delta: Number(yoyDelta(latest.average, prevYear.average)), spark: ratesData.monthly.slice(-12).map((d) => ({ value: d.average })) },
  { label: 'Residential Rate', value: latest.residential.toFixed(2), unit: '¢/kWh', delta: Number(yoyDelta(latest.residential, prevYear.residential)), spark: ratesData.monthly.slice(-12).map((d) => ({ value: d.residential })) },
  { label: 'Commercial Rate', value: latest.commercial.toFixed(2), unit: '¢/kWh', delta: Number(yoyDelta(latest.commercial, prevYear.commercial)), spark: ratesData.monthly.slice(-12).map((d) => ({ value: d.commercial })) },
  { label: 'Industrial Rate', value: latest.industrial.toFixed(2), unit: '¢/kWh', delta: Number(yoyDelta(latest.industrial, prevYear.industrial)), spark: ratesData.monthly.slice(-12).map((d) => ({ value: d.industrial })) },
]

const trendData = ratesData.monthly.map((d) => ({
  period: d.period.slice(2),
  Residential: d.residential,
  Commercial: d.commercial,
  Industrial: d.industrial,
}))

const componentData = ratesData.monthly.map((d) => ({
  period: d.period.slice(2),
  Base: d.components.base,
  Fuel: d.components.fuel,
  Riders: d.components.riders,
  Taxes: d.components.taxes,
}))

const peerCompare = [
  { group: 'Residential', utility: latest.residential, peer: latest.peerAvg * 1.08, national: latest.nationalAvg * 1.05 },
  { group: 'Commercial', utility: latest.commercial, peer: latest.peerAvg * 0.95, national: latest.nationalAvg * 0.92 },
  { group: 'Industrial', utility: latest.industrial, peer: latest.peerAvg * 0.72, national: latest.nationalAvg * 0.68 },
]

const tableColumns = [
  { key: 'class', label: 'Rate Class' },
  { key: 'current', label: 'Current Rate', align: 'right', render: (v) => `${v.toFixed(2)}¢` },
  { key: 'priorYear', label: 'Prior Year', align: 'right', render: (v) => `${v.toFixed(2)}¢` },
  { key: 'yoy', label: 'YoY Δ', align: 'right', render: (v) => <span className={v >= 0 ? 'text-negative' : 'text-positive'}>{v >= 0 ? '+' : ''}{v.toFixed(1)}%</span> },
  { key: 'peerAvg', label: 'Peer Avg', align: 'right', render: (v) => `${v.toFixed(2)}¢` },
  { key: 'nationalAvg', label: "Nat'l Avg", align: 'right', render: (v) => `${v.toFixed(2)}¢` },
]

const tableData = [
  { class: 'Residential', current: latest.residential, priorYear: prevYear.residential, yoy: Number(yoyDelta(latest.residential, prevYear.residential)), peerAvg: latest.peerAvg * 1.08, nationalAvg: latest.nationalAvg * 1.05 },
  { class: 'Commercial', current: latest.commercial, priorYear: prevYear.commercial, yoy: Number(yoyDelta(latest.commercial, prevYear.commercial)), peerAvg: latest.peerAvg * 0.95, nationalAvg: latest.nationalAvg * 0.92 },
  { class: 'Industrial', current: latest.industrial, priorYear: prevYear.industrial, yoy: Number(yoyDelta(latest.industrial, prevYear.industrial)), peerAvg: latest.peerAvg * 0.72, nationalAvg: latest.nationalAvg * 0.68 },
  { class: 'Average', current: latest.average, priorYear: prevYear.average, yoy: Number(yoyDelta(latest.average, prevYear.average)), peerAvg: latest.peerAvg, nationalAvg: latest.nationalAvg },
]

export default function Rates() {
  const [filter, setFilter] = useState('all')

  return (
    <>
      {/* KPI Strip */}
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} label={kpi.label} value={kpi.value} unit={kpi.unit} delta={kpi.delta} deltaSuffix="% YoY" sparklineData={kpi.spark} sparklineColor={CHART_COLORS.green} span={3} />
      ))}

      {/* Rate Trends */}
      <ChartCard title="Rate Trends by Class" span={12}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="period" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toFixed(2)}¢/kWh`} />} />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Line type="monotone" dataKey="Residential" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Commercial" stroke={CHART_COLORS.blue} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Industrial" stroke={CHART_COLORS.violet} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Component Breakdown + Peer Compare */}
      <ChartCard title="Rate Component Breakdown" span={6}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={componentData}>
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="period" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toFixed(2)}¢`} />} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Bar dataKey="Base" stackId="a" fill={CHART_COLORS.green} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Fuel" stackId="a" fill={CHART_COLORS.blue} />
              <Bar dataKey="Riders" stackId="a" fill={CHART_COLORS.violet} />
              <Bar dataKey="Taxes" stackId="a" fill={CHART_COLORS.amber} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Rate vs Peer Average (Current)" span={6}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peerCompare} layout="horizontal">
              <CartesianGrid {...CARTESIAN_GRID_PROPS} />
              <XAxis dataKey="group" {...X_AXIS_PROPS} />
              <YAxis {...Y_AXIS_PROPS} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v.toFixed(2)}¢/kWh`} />} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Bar dataKey="utility" name="Our Rate" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} />
              <Bar dataKey="peer" name="Peer Avg" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} />
              <Bar dataKey="national" name="National Avg" fill={CHART_COLORS.violet} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Rate Detail Table */}
      <div className="col-span-12 flex items-center justify-between">
        <FilterBar
          filters={[
            { value: 'all', label: 'All' },
            { value: 'residential', label: 'Residential' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'industrial', label: 'Industrial' },
          ]}
          active={filter}
          onChange={setFilter}
        />
        <ExportButton data={tableData} columns={tableColumns} filename="rate-detail.csv" />
      </div>
      <DataTable
        columns={tableColumns}
        data={filter === 'all' ? tableData : tableData.filter((r) => r.class.toLowerCase() === filter)}
      />
    </>
  )
}
