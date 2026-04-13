import Card from '../components/ui/Card'

export default function LoadForecasting() {
  return (
    <>
      <Card span={12}>
        <h2 className="text-2xl font-bold text-text-primary">Load Forecasting</h2>
        <p className="mt-2 text-text-secondary">
          Current and projected demand, weather impacts, and forecast accuracy. Content will be built in Phase 3.
        </p>
      </Card>

      {['Current System Load', 'Forecasted Peak', 'Weather-Adjusted Load', 'Forecast MAPE'].map((label) => (
        <Card key={label} span={3}>
          <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">--</p>
        </Card>
      ))}
    </>
  )
}
