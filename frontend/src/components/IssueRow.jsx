import { XCircle, AlertTriangle } from 'lucide-react'

export default function IssueRow({ issue }) {
  return (
    <div className="px-6 py-4 hover:bg-slate-800/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
          issue.severity === 'critical' ? 'bg-red-500/20' : 'bg-amber-500/20'
        }`}>
          {issue.severity === 'critical' ? (
            <XCircle className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{issue.screen}</span>
            <span className="text-slate-500">•</span>
            <span className="text-sm text-slate-400">{issue.device}</span>
          </div>
          <p className="text-sm text-slate-400 mb-2">{issue.issue}</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">{issue.detected}</span>
            {issue.assignee ? (
              <span className="text-violet-400">{issue.assignee}</span>
            ) : (
              <span className="text-amber-400">Unassigned</span>
            )}
          </div>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs transition-colors">
          View
        </button>
      </div>
    </div>
  )
}
