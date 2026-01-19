import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  XCircle, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Image
} from 'lucide-react'

// Sample data
const testData = {
  id: 1,
  screen: 'HomeScreen',
  totalDevices: 42,
  passed: 38,
  failed: 4,
  runTime: '2 saat önce',
  duration: '43 minutes',
  results: [
    {
      id: 1,
      device: 'Samsung Galaxy Z Fold 5 (Unfolded)',
      os: 'Android 14',
      status: 'failed',
      confidence: 94,
      issues: [
        {
          id: 1,
          severity: 'critical',
          category: 'layout',
          description: 'Hero card overflow - Card content overflows container on wide screen',
          location: { x: 200, y: 150, w: 400, h: 200 },
          rootCause: 'Fixed width constraint instead of responsive',
          suggestion: 'Use maxWidth instead of fixed width'
        },
        {
          id: 2,
          severity: 'critical',
          category: 'layout',
          description: 'Content grid overlap - Grid items overlap each other',
          location: { x: 0, y: 400, w: 1812, h: 600 },
          rootCause: 'Grid not adapting to tablet aspect ratio',
          suggestion: 'Implement adaptive grid columns for wide screens'
        },
        {
          id: 3,
          severity: 'minor',
          category: 'spacing',
          description: 'Spacing inconsistency - 4px extra padding on left side',
          location: { x: 16, y: 350, w: 100, h: 30 },
          rootCause: 'Safe area inset calculation',
          suggestion: 'Review safe area padding logic'
        }
      ]
    },
    {
      id: 2,
      device: 'iPhone SE (3rd gen)',
      os: 'iOS 17',
      status: 'failed',
      confidence: 91,
      issues: [
        {
          id: 1,
          severity: 'major',
          category: 'text',
          description: 'Text truncation in header - Title text is cut off',
          location: { x: 16, y: 60, w: 280, h: 24 },
          rootCause: 'Fixed container width on small screen',
          suggestion: 'Use dynamic text sizing or ellipsis'
        }
      ]
    },
    {
      id: 3,
      device: 'Samsung Galaxy S24 Ultra',
      os: 'Android 15',
      status: 'passed',
      confidence: 98,
      issues: []
    }
  ]
}

export default function TestDetail() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [selectedResultIndex, setSelectedResultIndex] = useState(0)
  
  const selectedResult = testData.results[selectedResultIndex]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20'
      case 'major': return 'text-amber-400 bg-amber-500/20'
      case 'minor': return 'text-blue-400 bg-blue-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{testData.screen}</h1>
            <p className="text-slate-400 mt-1">
              {testData.totalDevices} devices tested • {testData.runTime} • {testData.duration}
            </p>
          </div>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4" />
            Re-run Test
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Passed</span>
          </div>
          <p className="text-2xl font-bold">{testData.passed}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <XCircle className="w-4 h-4" />
            <span className="text-sm">Failed</span>
          </div>
          <p className="text-2xl font-bold">{testData.failed}</p>
        </div>
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-violet-400 mb-1">
            <span className="text-sm">AI Confidence</span>
          </div>
          <p className="text-2xl font-bold">{selectedResult.confidence}%</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Device List */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <h2 className="font-semibold">Device Results</h2>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {testData.results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => setSelectedResultIndex(index)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  selectedResultIndex === index 
                    ? 'bg-violet-500/20 border-l-2 border-violet-500' 
                    : 'hover:bg-slate-800 border-l-2 border-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  result.status === 'passed' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {result.status === 'passed' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{result.device}</p>
                  <p className="text-xs text-slate-500">{result.os}</p>
                </div>
                {result.issues.length > 0 && (
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                    {result.issues.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison View */}
        <div className="col-span-2 space-y-6">
          {/* Image Comparison */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-semibold">{selectedResult.device}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedResultIndex(prev => Math.max(0, prev - 1))}
                  disabled={selectedResultIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-400">
                  {selectedResultIndex + 1} / {testData.results.length}
                </span>
                <button
                  onClick={() => setSelectedResultIndex(prev => Math.min(testData.results.length - 1, prev + 1))}
                  disabled={selectedResultIndex === testData.results.length - 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2 text-center">Figma Baseline</p>
                  <div className="aspect-[9/16] bg-slate-800 rounded-lg flex items-center justify-center">
                    <Image className="w-12 h-12 text-slate-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2 text-center">Device Screenshot</p>
                  <div className="aspect-[9/16] bg-slate-800 rounded-lg flex items-center justify-center relative">
                    <Image className="w-12 h-12 text-slate-600" />
                    {/* Issue markers would go here */}
                    {selectedResult.issues.filter(i => i.severity === 'critical').length > 0 && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {selectedResult.issues.filter(i => i.severity === 'critical').length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="font-semibold">
                Issues Detected 
                {selectedResult.issues.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    ({selectedResult.issues.length})
                  </span>
                )}
              </h2>
            </div>
            
            {selectedResult.issues.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="font-medium">No issues detected!</p>
                <p className="text-sm text-slate-400 mt-1">This device passed all visual checks.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {selectedResult.issues.map(issue => (
                  <div key={issue.id} className="p-6">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 px-2 py-1 rounded text-xs font-medium uppercase ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{issue.description}</p>
                        <div className="mt-3 space-y-2 text-sm">
                          <p>
                            <span className="text-slate-400">Location:</span>{' '}
                            <code className="bg-slate-800 px-2 py-0.5 rounded text-xs">
                              x:{issue.location.x}, y:{issue.location.y}, w:{issue.location.w}, h:{issue.location.h}
                            </code>
                          </p>
                          <p>
                            <span className="text-slate-400">Root Cause:</span>{' '}
                            {issue.rootCause}
                          </p>
                          <p>
                            <span className="text-slate-400">Suggestion:</span>{' '}
                            <span className="text-violet-400">{issue.suggestion}</span>
                          </p>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-medium">
                            Create Jira
                          </button>
                          {issue.severity === 'minor' && (
                            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs">
                              Mark Acceptable
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
