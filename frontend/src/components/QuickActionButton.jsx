import { Link } from 'react-router-dom'

export default function QuickActionButton({ icon, label, description, to, onClick }) {
  const content = (
    <>
      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
    </>
  )

  const className = "w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-left flex items-center gap-3"

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  )
}
