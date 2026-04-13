import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function ExecutiveSummary() {
  return (
    <>
      <Card span={12}>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-text-primary">Executive Summary</h2>
          <Badge variant="info">Live</Badge>
        </div>
        <p className="mt-2 text-text-secondary">
          30-second scan of everything that matters. KPI cards, charts, and alerts will be built in Phase 3.
        </p>
      </Card>

      {/* Placeholder KPI strip */}
      {['Avg Retail Rate', 'System Peak Load', 'Revenue MTD', 'Forecast Accuracy', 'Peer Rank', 'Data Center Load'].map((label) => (
        <Card key={label} span={2}>
          <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">--</p>
        </Card>
      ))}
    </>
  )
}
