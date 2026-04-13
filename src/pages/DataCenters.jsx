import Card from '../components/ui/Card'

export default function DataCenters() {
  return (
    <>
      <Card span={12}>
        <h2 className="text-2xl font-bold text-text-primary">Data Centers</h2>
        <p className="mt-2 text-text-secondary">
          Track the growing data center load segment — capacity, growth, revenue impact. Content will be built in Phase 3.
        </p>
      </Card>

      {['Active Customers', 'Total DC Load', 'DC Revenue', 'Pipeline Load'].map((label) => (
        <Card key={label} span={3}>
          <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">--</p>
        </Card>
      ))}
    </>
  )
}
