import {
  LayoutDashboard,
  DollarSign,
  Zap,
  TrendingUp,
  BarChart3,
  Users,
  Server,
} from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'executive-summary', label: 'Executive Summary', icon: LayoutDashboard },
  { id: 'rates', label: 'Rates', icon: DollarSign },
  { id: 'load-forecasting', label: 'Load Forecasting', icon: Zap },
  { id: 'revenue-forecasting', label: 'Revenue Forecasting', icon: TrendingUp },
  { id: 'actual-vs-forecast', label: 'Actual vs Forecast', icon: BarChart3 },
  { id: 'peer-comparison', label: 'Peer & National Comparison', icon: Users },
  { id: 'data-centers', label: 'Data Centers', icon: Server },
]
