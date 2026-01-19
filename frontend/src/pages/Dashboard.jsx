import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Smartphone, 
  Monitor, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  Zap, 
  RefreshCw 
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import StatusBadge from '../components/StatusBadge'
import IssueRow from '../components/IssueRow'
import QuickActionButton from '../components/QuickActionButton'

// Sample data - will be replaced with API calls
const testResults = [
  { id: 1, screen: 'HomeScreen', devices: 42, passed: 38, failed: 4, status: 'warning', time: '2 saat önce' },
  { id: 2, screen: 'CallerIDScreen', devices: 42, passed: 42, failed: 0, status: 'success', time: '3 saat önce' },
  { id: 3, screen: 'SettingsScreen', devices: 42, passed: 41, failed: 1, status: 'warning', time: '5 saat önce' },
  { id: 4, screen: 'ProfileScreen', devices: 42, passed: 36, failed: 6, status: 'error', time: '6 saat önce' },
  { id: 5, screen: 'SpamBlocker', devices: 42, passed: 42, failed: 0, status: 'success', time: '8 saat önce' },
]

const criticalIssues = [
  {
    id: 1,
    screen: 'HomeScreen',
    device: 'Samsung Galaxy Z Fold 5 (Unfolded)',
    issue: 'Layout completely broken - elements overlapping',
    severity: 'critical',
    detected: '2 saat önce',
    assignee: '@designer_ali'
  },
  {
    id: 2,
    screen: 'ProfileScreen',
    device: 'iPhone SE (3rd gen)',
    issue: 'Text truncation in bio section',
    severity: 'critical',
    detected: '5 saat önce',
    assignee: null
  },
  {
    id: 3,
    screen: 'ProfileScreen',
    device: 'Xiaomi Redmi Note 13',
    issue: 'Button overflow on small screens',
    severity: 'major',
    detected: '6 saat önce',
    assignee: '@dev_mehmet'
  }
]

const deviceCoverage = [
  { platform: 'Android', devices: 25, coverage: 85 },
  { platform: 'iOS', devices: 15, coverage: 100 },
  { platform: 'Foldables', devices: 3, coverage: 33 },
]

export default function Dashboard() {
  const stats = {
    total: 127,
    passed: 98,
    failed: 24,
    inQueue: 5
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1">Visual testing overview for the last 7 days</p>
        </div>
        <Link 
          to="/new-test"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Test
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Total Tests"
          value={stats.total}
          icon={<Zap className="w-5 h-5" />}
          color="violet"
        />
        <StatsCard
          label="Passed"
          value={stats.passed}
          percentage={Math.round((stats.passed / stats.total) * 100)}
          icon={<CheckCircle className="w-5 h-5" />}
          color="emerald"
        />
        <StatsCard
          label="Failed"
          value={stats.failed}
          percentage={Math.round((stats.failed / stats.total) * 100)}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
        />
        <StatsCard
          label="In Queue"
          value={stats.inQueue}
          percentage={Math.round((stats.inQueue / stats.total) * 100)}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Critical Issues */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h2 className="font-semibold">Critical Issues</h2>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                  {criticalIssues.filter(i => i.severity === 'critical').length} action required
                </span>
              </div>
              <button className="text-sm text-violet-400 hover:text-violet-300">View All</button>
            </div>
            <div className="divide-y divide-slate-800">
              {criticalIssues.map(issue => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          </div>

          {/* Recent Test Runs */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-slate-400" />
                <h2 className="font-semibold">Recent Test Runs</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                  <Search className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                  <Filter className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Screen</th>
                    <th className="px-6 py-3">Devices</th>
                    <th className="px-6 py-3">Passed</th>
                    <th className="px-6 py-3">Failed</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {testResults.map(test => (
                    <tr 
                      key={test.id} 
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium">{test.screen}</td>
                      <td className="px-6 py-4 text-slate-400">{test.devices}</td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-400">{test.passed}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={test.failed > 0 ? 'text-red-400' : 'text-slate-500'}>
                          {test.failed}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={test.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{test.time}</td>
                      <td className="px-6 py-4">
                        <Link to={`/test/${test.id}`}>
                          <ChevronRight className="w-4 h-4 text-slate-500 hover:text-white" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Device Coverage */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold">Device Coverage</h2>
            </div>
            <div className="space-y-4">
              {deviceCoverage.map(platform => (
                <div key={platform.platform}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{platform.platform}</span>
                    <span className="text-sm text-slate-400">{platform.devices} devices</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        platform.coverage === 100 ? 'bg-emerald-500' : 
                        platform.coverage > 50 ? 'bg-violet-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${platform.coverage}%` }}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-xs text-slate-500">{platform.coverage}% tested</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <QuickActionButton 
                icon={<Plus className="w-4 h-4" />}
                label="Create New Test"
                description="Test a Figma screen"
                to="/new-test"
              />
              <QuickActionButton 
                icon={<RefreshCw className="w-4 h-4" />}
                label="Re-run All Failed"
                description="24 tests will run"
              />
              <QuickActionButton 
                icon={<Monitor className="w-4 h-4" />}
                label="Add Device Group"
                description="Configure test devices"
                to="/devices"
              />
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 rounded-2xl border border-violet-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="font-semibold">AI Insights</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="text-violet-300">🔍 Pattern Detected</p>
                <p className="text-slate-400 mt-1">
                  Foldable devices show 67% failure rate on HomeScreen. Consider adding responsive breakpoints.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="text-violet-300">📱 Device Alert</p>
                <p className="text-slate-400 mt-1">
                  iPhone SE consistently fails text truncation tests. Font scaling may need adjustment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
