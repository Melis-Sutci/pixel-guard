import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export default function StatusBadge({ status }) {
  const styles = {
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/20 text-amber-400',
    error: 'bg-red-500/20 text-red-400',
  }

  const icons = {
    success: <CheckCircle className="w-3.5 h-3.5" />,
    warning: <AlertTriangle className="w-3.5 h-3.5" />,
    error: <XCircle className="w-3.5 h-3.5" />,
  }

  const labels = {
    success: 'Passed',
    warning: 'Issues',
    error: 'Failed',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {icons[status]}
      {labels[status]}
    </span>
  )
}
