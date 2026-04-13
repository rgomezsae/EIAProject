import Card from '../components/ui/Card'

export default function ActualVsForecast() {
  return (
    <>
      <Card span={12}>
        <h2 className="text-2xl font-bold text-text-primary">Actual vs Forecast</h2>
        <p className="mt-2 text-text-secondary">
          Cross-functional accuracy view — how well is the organization predicting outcomes? Content will be built in Phase 3.
        </p>
      </Card>

      {['Overall Forecast Accuracy', 'Best Performing Category', 'Worst Performing Category'].map((label) => (
        <Card key={label} span={4}>
          <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">--</p>
        </Card>
      ))}
    </>
  )
}
