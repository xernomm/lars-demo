import { useState } from 'react'
import { Calendar, DollarSign, TrendingUp, Clock, Flag, ChevronDown, Target } from 'lucide-react'

const ganttTasks = [
  { id: 'T1', name: 'Project Planning', startWeek: 1, duration: 4, progress: 100, status: 'completed' as const, category: 'Planning' },
  { id: 'T2', name: 'Design & Engineering', startWeek: 3, duration: 8, progress: 100, status: 'completed' as const, category: 'Planning' },
  { id: 'T3', name: 'Material Procurement', startWeek: 6, duration: 10, progress: 85, status: 'in-progress' as const, category: 'Procurement' },
  { id: 'T4', name: 'Steel Cutting', startWeek: 10, duration: 6, progress: 70, status: 'in-progress' as const, category: 'Production' },
  { id: 'T5', name: 'Fabrication & Assembly', startWeek: 14, duration: 12, progress: 45, status: 'in-progress' as const, category: 'Production' },
  { id: 'T6', name: 'Hull Welding', startWeek: 18, duration: 10, progress: 30, status: 'in-progress' as const, category: 'Production' },
  { id: 'T7', name: 'Blasting & Painting', startWeek: 24, duration: 8, progress: 0, status: 'pending' as const, category: 'Finishing' },
  { id: 'T8', name: 'Outfitting', startWeek: 26, duration: 10, progress: 0, status: 'pending' as const, category: 'Finishing' },
  { id: 'T9', name: 'Testing & Commissioning', startWeek: 32, duration: 6, progress: 0, status: 'pending' as const, category: 'QA/QC' },
  { id: 'T10', name: 'Sea Trial', startWeek: 36, duration: 3, progress: 0, status: 'pending' as const, category: 'Completion' },
  { id: 'T11', name: 'Delivery & Handover', startWeek: 38, duration: 2, progress: 0, status: 'pending' as const, category: 'Completion' },
]

const milestones = [
  { name: 'Keel Laying', date: '15 Jan 2026', status: 'done' },
  { name: 'Hull Completion', date: '20 Jun 2026', status: 'in-progress' },
  { name: 'Launching', date: '15 Sep 2026', status: 'pending' },
  { name: 'Sea Trial', date: '10 Nov 2026', status: 'pending' },
  { name: 'Delivery', date: '20 Dec 2026', status: 'pending' },
]

export default function ProjectManagement() {
  const [baseline, setBaseline] = useState('Baseline 1 (Original)')
  const totalWeeks = 40

  const getBarColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500'
      case 'in-progress': return 'bg-blue-600'
      case 'delayed': return 'bg-red-500'
      default: return 'bg-slate-300'
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-600'
      case 'in-progress': return 'bg-blue-500'
      default: return 'bg-slate-400'
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
          <p className="text-sm text-slate-500 font-medium">300 FT Barge — Project #001</p>
        </div>
        <div className="relative">
          <select
            value={baseline}
            onChange={(e) => setBaseline(e.target.value)}
            className="bg-white border border-slate-200 text-sm text-slate-800 rounded-lg px-3.5 py-2 appearance-none pr-9 focus:outline-none focus:border-blue-500 shadow-xs font-medium"
          >
            <option>Baseline 1 (Original)</option>
            <option>Baseline 2 (Revised Apr 2026)</option>
            <option>Baseline 3 (Revised Jul 2026)</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Planned Budget', value: '$12.3B', sub: 'Target baseline', icon: DollarSign, color: 'bg-blue-50/60 border-blue-200', iconColor: 'text-blue-600', valColor: 'text-blue-900' },
          { label: 'Actual Cost', value: '$11.7B', sub: '4.9% cost savings', icon: TrendingUp, color: 'bg-emerald-50/60 border-emerald-200', iconColor: 'text-emerald-600', valColor: 'text-emerald-900' },
          { label: 'Timeline Status', value: 'On Track', sub: 'Est. delivery Q4 2026', icon: Clock, color: 'bg-sky-50/60 border-sky-200', iconColor: 'text-sky-600', valColor: 'text-sky-900' },
          { label: 'Overall Progress', value: '82%', sub: '22/27 milestones', icon: Target, color: 'bg-indigo-50/60 border-indigo-200', iconColor: 'text-indigo-600', valColor: 'text-indigo-900' },
        ].map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className={`glass-card rounded-xl p-8 border ${card.color} shadow-xs`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">{card.label}</span>
                <Icon size={18} className={card.iconColor} />
              </div>
              <p className={`text-2xl font-bold ${card.valColor}`}>{card.value}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">{card.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Budget Comparison */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-blue-600" />
          Planned vs Actual Budget Breakdown
        </h2>
        <div className="space-y-3.5">
          {[
            { label: 'Materials', planned: 5.2, actual: 4.8, unit: 'B' },
            { label: 'Labor', planned: 3.1, actual: 3.3, unit: 'B' },
            { label: 'Equipment', planned: 2.0, actual: 1.8, unit: 'B' },
            { label: 'Overhead', planned: 1.2, actual: 1.1, unit: 'B' },
            { label: 'Contingency', planned: 0.8, actual: 0.7, unit: 'B' },
          ].map((item, idx) => {
            const maxVal = Math.max(item.planned, item.actual)
            const plannedWidth = (item.planned / maxVal) * 100
            const actualWidth = (item.actual / maxVal) * 100
            const variance = ((item.planned - item.actual) / item.planned * 100).toFixed(1)
            const isOver = item.actual > item.planned
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  <span className={`text-[11px] font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                    {isOver ? '+' : '-'}{Math.abs(Number(variance))}%
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-slate-500 w-16">Planned</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${plannedWidth}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 w-12 text-right">${item.planned}{item.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-slate-500 w-16">Actual</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${actualWidth}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 w-12 text-right">${item.actual}{item.unit}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-blue-600" />
          Gantt Chart — Project Timeline
        </h2>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Week Headers */}
            <div className="flex mb-2 pb-2 border-b border-slate-100">
              <div className="w-48 flex-shrink-0 font-semibold text-xs text-slate-600">Task Name</div>
              <div className="flex-1 flex">
                {Array.from({ length: Math.ceil(totalWeeks / 4) }, (_, i) => (
                  <div key={i} className="flex-1 text-center text-[10px] font-semibold text-slate-500 border-l border-slate-200 px-1">
                    Month {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            {ganttTasks.map((task) => (
              <div key={task.id} className="flex items-center my-2 group">
                <div className="w-48 flex-shrink-0 pr-3">
                  <span className="text-xs text-slate-800 font-medium truncate block">{task.name}</span>
                </div>
                <div className="flex-1 relative h-7 bg-slate-100 rounded-lg">
                  {/* Grid lines */}
                  {Array.from({ length: Math.ceil(totalWeeks / 4) }, (_, i) => (
                    <div key={i} className="absolute top-0 bottom-0 border-l border-slate-200/60" style={{ left: `${(i * 4 / totalWeeks) * 100}%` }} />
                  ))}
                  {/* Bar */}
                  <div
                    className={`absolute top-1 bottom-1 rounded-md ${getBarColor(task.status)} opacity-30`}
                    style={{ left: `${(task.startWeek / totalWeeks) * 100}%`, width: `${(task.duration / totalWeeks) * 100}%` }}
                  />
                  {/* Progress */}
                  <div
                    className={`absolute top-1 bottom-1 rounded-md ${getProgressColor(task.status)} shadow-xs`}
                    style={{ left: `${(task.startWeek / totalWeeks) * 100}%`, width: `${((task.duration * task.progress / 100) / totalWeeks) * 100}%` }}
                  />
                  {/* Label */}
                  <div
                    className="absolute top-0 bottom-0 flex items-center px-2"
                    style={{ left: `${(task.startWeek / totalWeeks) * 100}%` }}
                  >
                    <span className="text-[10px] text-white font-bold whitespace-nowrap drop-shadow-xs">{task.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Flag size={16} className="text-blue-600" />
          Project Milestones
        </h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {milestones.map((ms, idx) => (
            <div key={idx} className="flex items-center gap-3 flex-shrink-0">
              <div className={`flex flex-col items-center p-3.5 rounded-xl border min-w-[130px] transition-all ${ms.status === 'done' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                ms.status === 'in-progress' ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-xs' :
                  'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                <Flag size={16} className={ms.status === 'done' ? 'text-emerald-600' : ms.status === 'in-progress' ? 'text-blue-600' : 'text-slate-400'} />
                <span className="text-xs font-bold mt-1 text-center">{ms.name}</span>
                <span className="text-[10px] font-medium text-slate-500 mt-0.5">{ms.date}</span>
              </div>
              {idx < milestones.length - 1 && (
                <div className={`w-8 h-0.5 flex-shrink-0 ${ms.status === 'done' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
