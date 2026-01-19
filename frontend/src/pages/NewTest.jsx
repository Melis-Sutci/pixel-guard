import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  Link as LinkIcon, 
  Check, 
  Smartphone,
  Loader2,
  Image
} from 'lucide-react'

const steps = [
  { id: 1, title: 'Select Screen', description: 'Enter Figma URL' },
  { id: 2, title: 'Select Devices', description: 'Choose test devices' },
  { id: 3, title: 'Configure', description: 'Set options' },
  { id: 4, title: 'Review', description: 'Confirm and run' },
]

const deviceGroups = {
  android: [
    { id: 'a1', name: 'Samsung Galaxy S24 Ultra', os: 'Android 15', resolution: '1440x3120', checked: true },
    { id: 'a2', name: 'Samsung Galaxy S21', os: 'Android 13', resolution: '1080x2400', checked: true },
    { id: 'a3', name: 'Samsung Galaxy A54', os: 'Android 14', resolution: '1080x2340', checked: true },
    { id: 'a4', name: 'Samsung Galaxy Z Fold 5', os: 'Android 14', resolution: '1812x2176', checked: true },
    { id: 'a5', name: 'Google Pixel 9 Pro', os: 'Android 15', resolution: '1344x2992', checked: true },
    { id: 'a6', name: 'Xiaomi Redmi Note 13', os: 'Android 14', resolution: '1080x2400', checked: false },
  ],
  ios: [
    { id: 'i1', name: 'iPhone 16 Pro Max', os: 'iOS 18', resolution: '1290x2796', checked: true },
    { id: 'i2', name: 'iPhone 14', os: 'iOS 17', resolution: '1170x2532', checked: true },
    { id: 'i3', name: 'iPhone SE (3rd gen)', os: 'iOS 17', resolution: '750x1334', checked: true },
    { id: 'i4', name: 'iPhone 11', os: 'iOS 17', resolution: '828x1792', checked: true },
  ]
}

export default function NewTest() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [figmaUrl, setFigmaUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [screenDetected, setScreenDetected] = useState(false)
  const [devices, setDevices] = useState(deviceGroups)

  const handleFetchFigma = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setScreenDetected(true)
    setIsLoading(false)
  }

  const toggleDevice = (platform, deviceId) => {
    setDevices(prev => ({
      ...prev,
      [platform]: prev[platform].map(d => 
        d.id === deviceId ? { ...d, checked: !d.checked } : d
      )
    }))
  }

  const selectedCount = Object.values(devices).flat().filter(d => d.checked).length

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Create New Visual Test</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center ${index > 0 ? 'ml-4' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id < currentStep 
                    ? 'bg-emerald-500 text-white' 
                    : step.id === currentStep 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${step.id === currentStep ? 'text-white' : 'text-slate-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 ml-4 ${
                  step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-800'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 1: Select Screen</h2>
            <p className="text-slate-400 mb-6">
              Paste the Figma URL of the screen you want to test.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Figma URL</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    placeholder="https://www.figma.com/file/..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleFetchFigma}
                  disabled={!figmaUrl || isLoading}
                  className="px-4 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    'Fetch from Figma'
                  )}
                </button>
              </div>
            </div>

            {screenDetected && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Screen detected: "Home Screen - Logged In State"</span>
                </div>
                <div className="flex gap-6">
                  <div className="w-32 h-48 bg-slate-800 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-slate-600" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-400">Dimensions:</span> 390 x 844</p>
                    <p><span className="text-slate-400">Components:</span> 24</p>
                    <p><span className="text-slate-400">Design Tokens:</span> 18</p>
                    <p><span className="text-slate-400">Last Updated:</span> Jan 18, 2026</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 2: Select Devices</h2>
            <p className="text-slate-400 mb-6">
              Choose which devices to test on. Selected: <span className="text-violet-400 font-medium">{selectedCount} devices</span>
            </p>

            {/* Quick Select */}
            <div className="flex gap-2 mb-6">
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium">
                All Android
              </button>
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium">
                All iOS
              </button>
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium">
                Flagships Only
              </button>
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium">
                Foldables
              </button>
            </div>

            {/* Android Devices */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                Android
              </h3>
              <div className="space-y-2">
                {devices.android.map(device => (
                  <label 
                    key={device.id}
                    className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={device.checked}
                      onChange={() => toggleDevice('android', device.id)}
                      className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-violet-500 focus:ring-violet-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{device.name}</span>
                      <span className="text-slate-400 ml-2">{device.os}</span>
                    </div>
                    <span className="text-xs text-slate-500">{device.resolution}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* iOS Devices */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                iOS
              </h3>
              <div className="space-y-2">
                {devices.ios.map(device => (
                  <label 
                    key={device.id}
                    className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={device.checked}
                      onChange={() => toggleDevice('ios', device.id)}
                      className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-violet-500 focus:ring-violet-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{device.name}</span>
                      <span className="text-slate-400 ml-2">{device.os}</span>
                    </div>
                    <span className="text-xs text-slate-500">{device.resolution}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-slate-800 rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Estimated time:</span>
                <span>~45 minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-400">Estimated cost:</span>
                <span>$12.50</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 3: Configure Options</h2>
            <p className="text-slate-400 mb-6">
              Fine-tune your test settings.
            </p>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div>
                  <p className="font-medium">Ignore Dynamic Content</p>
                  <p className="text-sm text-slate-400">Skip timestamps, ads, and user-generated content</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div>
                  <p className="font-medium">Strict Color Matching</p>
                  <p className="text-sm text-slate-400">Flag any color deviation from design</p>
                </div>
                <input type="checkbox" className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div>
                  <p className="font-medium">Create Jira Tickets</p>
                  <p className="text-sm text-slate-400">Auto-create tickets for critical issues</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div>
                  <p className="font-medium">Slack Notifications</p>
                  <p className="text-sm text-slate-400">Send alerts to #design-qa channel</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-violet-500" />
              </label>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 4: Review & Run</h2>
            <p className="text-slate-400 mb-6">
              Confirm your test configuration before running.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-xl">
                <p className="text-sm text-slate-400 mb-1">Screen</p>
                <p className="font-medium">Home Screen - Logged In State</p>
              </div>

              <div className="p-4 bg-slate-800 rounded-xl">
                <p className="text-sm text-slate-400 mb-1">Devices</p>
                <p className="font-medium">{selectedCount} devices selected</p>
                <p className="text-sm text-slate-400 mt-1">
                  {devices.android.filter(d => d.checked).length} Android, {devices.ios.filter(d => d.checked).length} iOS
                </p>
              </div>

              <div className="p-4 bg-slate-800 rounded-xl">
                <p className="text-sm text-slate-400 mb-1">Estimated</p>
                <p className="font-medium">~45 minutes • $12.50</p>
              </div>

              <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <p className="text-violet-300 font-medium">Ready to run!</p>
                <p className="text-sm text-slate-400 mt-1">
                  AI will compare Figma design with screenshots from {selectedCount} real devices.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={currentStep === 1 && !screenDetected}
            className="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl font-medium"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl font-medium"
          >
            Run Test
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
