import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  Eye, 
  LayoutDashboard, 
  Plus, 
  Smartphone, 
  Settings,
  ChevronRight
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/new-test', icon: Plus, label: 'New Test' },
  { path: '/devices', icon: Smartphone, label: 'Devices' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">PixelGuard</h1>
              <p className="text-xs text-slate-400">AI Visual Testing</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-violet-500/20 text-violet-400' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 border border-violet-500/20">
            <p className="text-xs text-violet-300 font-medium">AI Status</p>
            <p className="text-sm text-slate-300 mt-1">Claude Vision Active</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400">Ready</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
