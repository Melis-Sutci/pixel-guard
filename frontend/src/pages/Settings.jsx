import { useState } from 'react'
import { 
  Settings as SettingsIcon,
  Key,
  Bell,
  Palette,
  Shield,
  Save,
  ExternalLink,
  CheckCircle
} from 'lucide-react'

export default function Settings() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">Configure PixelGuard preferences and integrations</p>
      </div>

      <div className="space-y-6">
        {/* API Keys */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-violet-400" />
            <h2 className="font-semibold">API Keys</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Figma Access Token</label>
              <input
                type="password"
                placeholder="figd_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <p className="text-xs text-slate-500 mt-2">
                Get your token from{' '}
                <a href="#" className="text-violet-400 hover:text-violet-300">
                  Figma Settings → Personal Access Tokens
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">BrowserStack Username</label>
              <input
                type="text"
                placeholder="your_username"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">BrowserStack Access Key</label>
              <input
                type="password"
                placeholder="xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Anthropic API Key (Claude)</label>
              <input
                type="password"
                placeholder="sk-ant-xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-violet-400" />
            <h2 className="font-semibold">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
              <div>
                <p className="font-medium">Slack Notifications</p>
                <p className="text-sm text-slate-400">Send alerts to Slack channel</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
            </label>

            <div>
              <label className="block text-sm font-medium mb-2">Slack Webhook URL</label>
              <input
                type="text"
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-slate-400">Send summary emails for test runs</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
            </label>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-violet-400" />
            <h2 className="font-semibold">Integrations</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
              <div>
                <p className="font-medium">Jira Integration</p>
                <p className="text-sm text-slate-400">Auto-create tickets for critical issues</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
            </label>

            <div>
              <label className="block text-sm font-medium mb-2">Jira Project Key</label>
              <input
                type="text"
                placeholder="GETCONTACT"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
              <div>
                <p className="font-medium">GitHub Actions</p>
                <p className="text-sm text-slate-400">Run tests on every PR</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
            </label>
          </div>
        </div>

        {/* Tolerance Settings */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <Palette className="w-5 h-5 text-violet-400" />
            <h2 className="font-semibold">Comparison Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Spacing Tolerance (px)</label>
              <input
                type="number"
                defaultValue={2}
                className="w-32 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <p className="text-xs text-slate-500 mt-2">Allow this much spacing difference before flagging</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color Tolerance (Delta E)</label>
              <input
                type="number"
                defaultValue={5}
                className="w-32 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <p className="text-xs text-slate-500 mt-2">Color difference threshold (0-100, lower = stricter)</p>
            </div>

            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
              <div>
                <p className="font-medium">Ignore System UI</p>
                <p className="text-sm text-slate-400">Don't flag status bar, navigation bar differences</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
              <div>
                <p className="font-medium">Ignore Font Rendering</p>
                <p className="text-sm text-slate-400">Allow minor font rendering differences across platforms</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-medium flex items-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
