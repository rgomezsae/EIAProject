import Sidebar from './Sidebar'
import TopBar from './TopBar'
import ContentArea from './ContentArea'

export default function AppShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area (TopBar + Content) */}
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <ContentArea>
          {children}
        </ContentArea>
      </div>
    </div>
  )
}
