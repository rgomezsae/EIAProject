import Card from '../components/ui/Card'

export default function Rates() {
  return (
    <>
      <Card span={12}>
        <h2 className="text-2xl font-bold text-text-primary">Rates</h2>
        <p className="mt-2 text-text-secondary">
          Deep-dive into rate structures, trends, and comparisons. Content will be built in Phase 3.
        </p>
      </Card>

      {['Current Avg Retail Rate', 'Residential Rate', 'Commercial Rate', 'Industrial Rate'].map((label) => (
        <Card key={label} span={3}>
          <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">--</p>
        </Card>
      ))}
    </>
  )
}
