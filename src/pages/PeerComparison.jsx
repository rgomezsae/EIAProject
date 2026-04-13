import Card from '../components/ui/Card'

export default function PeerComparison() {
  return (
    <>
      <Card span={12}>
        <h2 className="text-2xl font-bold text-text-primary">Peer & National Comparison</h2>
        <p className="mt-2 text-text-secondary">
          Benchmark against similar utilities and national averages. Content will be built in Phase 3.
        </p>
      </Card>

      {['Peer Rank (Overall)', 'Rate Percentile', 'Reliability Rank', 'Customer Satisfaction'].map((label) => (
        <Card key={label} span={3}>
          <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">--</p>
        </Card>
      ))}
    </>
  )
}
