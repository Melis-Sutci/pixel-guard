import { useState } from 'react'
import { 
  Smartphone, 
  Plus, 
  Search, 
  Check,
  Trash2,
  Edit2
} from 'lucide-react'

const allDevices = {
  android: [
    { id: 'a1', name: 'Samsung Galaxy S24 Ultra', os: 'Android 15', resolution: '1440x3120', category: 'flagship' },
    { id: 'a2', name: 'Samsung Galaxy S23', os: 'Android 14', resolution: '1080x2340', category: 'flagship' },
    { id: 'a3', name: 'Samsung Galaxy S21', os: 'Android 13', resolution: '1080x2400', category: 'flagship' },
    { id: 'a4', name: 'Samsung Galaxy A54', os: 'Android 14', resolution: '1080x2340', category: 'midrange' },
    { id: 'a5', name: 'Samsung Galaxy A14', os: 'Android 13', resolution: '1080x2408', category: 'budget' },
    { id: 'a6', name: 'Samsung Galaxy Z Fold 5', os: 'Android 14', resolution: '1812x2176', category: 'foldable' },
    { id: 'a7', name: 'Samsung Galaxy Z Flip 5', os: 'Android 14', resolution: '1080x2640', category: 'foldable' },
    { id: 'a8', name: 'Google Pixel 9 Pro', os: 'Android 15', resolution: '1344x2992', category: 'flagship' },
    { id: 'a9', name: 'Google Pixel 8', os: 'Android 14', resolution: '1080x2400', category: 'flagship' },
    { id: 'a10', name: 'Google Pixel 6', os: 'Android 14', resolution: '1080x2400', category: 'flagship' },
    { id: 'a11', name: 'Xiaomi Redmi Note 13', os: 'Android 14', resolution: '1080x2400', category: 'midrange' },
    { id: 'a12', name: 'OnePlus 12', os: 'Android 14', resolution: '1440x3168', category: 'flagship' },
  ],
  ios: [
    { id: 'i1', name: 'iPhone 16 Pro Max', os: 'iOS 18', resolution: '1290x2796', category: 'flagship' },
    { id: 'i2', name: 'iPhone 16', os: 'iOS 18', resolution: '1179x2556', category: 'flagship' },
    { id: 'i3', name: 'iPhone 15 Pro', os: 'iOS 18', resolution: '1179x2556', category: 'flagship' },
    { id: 'i4', name: 'iPhone 14', os: 'iOS 17', resolution: '1170x2532', category: 'flagship' },
    { id: 'i5', name: 'iPhone 13', os: 'iOS 17', resolution: '1170x2532', category: 'common' },
    { id: 'i6', name: 'iPhone 12', os: 'iOS 16', resolution: '1170x2532', category: 'common' },
    { id: 'i7', name: 'iPhone SE (3rd gen)', os: 'iOS 17', resolution: '750x1334', category: 'budget' },
    { id: 'i8', name: 'iPhone 11', os: 'iOS 17', resolution: '828x1792', category: 'legacy' },
    { id: 'i9', name: 'iPhone XR', os: 'iOS 16', resolution: '828x1792', category: 'legacy' },
  ]
}

const deviceGroups = [
  { id: 1, name: 'Default Test Suite', devices: 18, description: 'Standard device coverage for all tests' },
  { id: 2, name: 'Foldables Only', devices: 2, description: 'Samsung Galaxy Z Fold and Z Flip' },
  { id: 3, name: 'Budget Devices', devices: 5, description: 'Lower-end devices for performance testing' },
  { id: 4, name: 'iOS Only', devices: 9, description: 'All iOS devices' },
]

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  const filteredDevices = () => {
    let devices = []
    
    if (selectedPlatform === 'all' || selectedPlatform === 'android') {
      devices = [...devices, ...allDevices.android.map(d => ({ ...d, platform: 'android' }))]
    }
    if (selectedPlatform === 'all' || selectedPlatform === 'ios') {
      devices = [...devices, ...allDevices.ios.map(d => ({ ...d, platform: 'ios' }))]
    }
    
    if (searchTerm) {
      devices = devices.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.os.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return devices
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Devices</h1>
          <p className="text-slate-400 mt-1">Manage test devices and device groups</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-colors flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          New Device Group
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Device Groups */}
        <div className="space-y-4">
          <h2 className="font-semibold">Device Groups</h2>
          {deviceGroups.map(group => (
            <div 
              key={group.id}
              className="bg-slate-900 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{group.name}</h3>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-slate-800">
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-800">
                    <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">{group.description}</p>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-violet-400" />
                <span className="text-sm">{group.devices} devices</span>
              </div>
            </div>
          ))}
        </div>

        {/* All Devices */}
        <div className="col-span-2">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold">All Available Devices</h2>
                <span className="text-sm text-slate-400">
                  {allDevices.android.length + allDevices.ios.length} total
                </span>
              </div>
              
              {/* Filters */}
              <div className="flex items-center gap-3 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search devices..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="all">All Platforms</option>
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                </select>
              </div>
            </div>

            {/* Device List */}
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-900">
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3 w-8"></th>
                    <th className="px-6 py-3">Device</th>
                    <th className="px-6 py-3">OS</th>
                    <th className="px-6 py-3">Resolution</th>
                    <th className="px-6 py-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredDevices().map(device => (
                    <tr key={device.id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-violet-500"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Smartphone className={`w-4 h-4 ${device.platform === 'ios' ? 'text-blue-400' : 'text-emerald-400'}`} />
                          <span className="font-medium">{device.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-400">{device.os}</td>
                      <td className="px-6 py-3 text-slate-400 text-sm font-mono">{device.resolution}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          device.category === 'flagship' ? 'bg-violet-500/20 text-violet-400' :
                          device.category === 'foldable' ? 'bg-amber-500/20 text-amber-400' :
                          device.category === 'budget' ? 'bg-blue-500/20 text-blue-400' :
                          device.category === 'legacy' ? 'bg-slate-500/20 text-slate-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {device.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
