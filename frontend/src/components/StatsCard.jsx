export default function StatsCard({ label, value, percentage, icon, color }) {
  const colorClasses = {
    violet: 'from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/20',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    red: 'from-red-500/20 to-red-500/5 text-red-400 border-red-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl border p-6`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-sm">{label}</span>
        {icon}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold">{value}</span>
        {percentage !== undefined && (
          <span className="text-sm text-slate-500 mb-1">({percentage}%)</span>
        )}
      </div>
    </div>
  )
}
