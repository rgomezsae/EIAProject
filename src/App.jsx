import { NavigationProvider, useNavigation } from './hooks/useNavigation'
import AppShell from './components/layout/AppShell'

import ExecutiveSummary from './pages/ExecutiveSummary'
import Rates from './pages/Rates'
import LoadForecasting from './pages/LoadForecasting'
import RevenueForecasting from './pages/RevenueForecasting'
import ActualVsForecast from './pages/ActualVsForecast'
import PeerComparison from './pages/PeerComparison'
import DataCenters from './pages/DataCenters'

const PAGES = {
  'executive-summary': ExecutiveSummary,
  'rates': Rates,
  'load-forecasting': LoadForecasting,
  'revenue-forecasting': RevenueForecasting,
  'actual-vs-forecast': ActualVsForecast,
  'peer-comparison': PeerComparison,
  'data-centers': DataCenters,
}

function PageRenderer() {
  const { currentPage } = useNavigation()
  const Page = PAGES[currentPage] || ExecutiveSummary
  return <Page />
}

export default function App() {
  return (
    <NavigationProvider>
      <AppShell>
        <PageRenderer />
      </AppShell>
    </NavigationProvider>
  )
}
