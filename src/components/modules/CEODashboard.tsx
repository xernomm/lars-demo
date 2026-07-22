import { useState } from 'react'
import { BarChart3, TrendingUp, DollarSign, Target, Sparkles, Loader2, Award, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { generateExecutiveSummary } from '../../services/geminiService'
import MarkdownRenderer from '../MarkdownRenderer'

export default function CEODashboard() {
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSummary = async () => {
    setIsGenerating(true)
    try {
      const summary = await generateExecutiveSummary()
      setExecutiveSummary(summary)
    } catch {
      setExecutiveSummary('⚠️ Failed to generate Executive Summary. Please try again.')
    }
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CEO Executive Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Shipyard Operational KPIs & Executive Financial Overview — 300 FT Barge</p>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {isGenerating ? 'Generating AI Summary...' : 'Generate Executive AI Summary'}
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Construction Progress', value: '82%', sub: '22 of 27 Milestones Completed', icon: Target, color: 'bg-blue-50/60 border-blue-200', text: 'text-blue-900' },
          { label: 'Planned Budget', value: '$12.3B', sub: 'Baseline Target Budget', icon: DollarSign, color: 'bg-indigo-50/60 border-indigo-200', text: 'text-indigo-900' },
          { label: 'Actual Cost Incurred', value: '$11.7B', sub: '4.9% Cost Savings ($600M)', icon: TrendingUp, color: 'bg-emerald-50/60 border-emerald-200', text: 'text-emerald-900' },
          { label: 'Estimated Delivery Date', value: 'Dec 2026', sub: 'On Schedule (0 Days Delay)', icon: Award, color: 'bg-sky-50/60 border-sky-200', text: 'text-sky-900' },
        ].map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className={`glass-card rounded-xl p-4.5 border ${card.color} shadow-xs`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">{card.label}</span>
                <Icon size={18} className="text-slate-600" />
              </div>
              <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">{card.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Generated Executive Summary Card */}
      {executiveSummary && (
        <div className="glass-card rounded-xl p-6 border-2 border-blue-200 bg-blue-50/20 slide-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-blue-200/60">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Shipyard CEO Executive AI Intelligence Report</h2>
            </div>
            <button onClick={() => setExecutiveSummary(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Dismiss
            </button>
          </div>
          <MarkdownRenderer content={executiveSummary} />
        </div>
      )}

      {/* Operational Highlights & Financial Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-600" /> Key Operational Highlights
          </h2>
          <div className="space-y-2.5">
            {[
              { title: 'Hull Welding Completion', desc: '45% progress on main structural joints. BKI NDT audit scheduled for May 28.', status: 'In Progress' },
              { title: 'Material Supply Chain', desc: '100% steel plates delivered (205 Tons). Zero procurement bottlenecks.', status: 'On Track' },
              { title: 'Industrial Safety Record', desc: '1,420 Zero Harm LTI working hours achieved across all yard shifts.', status: 'Optimal' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <span className="badge badge-success text-[10px] font-bold">{item.status}</span>
                </div>
                <p className="text-slate-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600" /> Cost Variance & Financial Efficiency
          </h2>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Material Cost Variance</span>
                <span className="text-emerald-600">-$400M (7.7% Savings)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92.3%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Labor Efficiency</span>
                <span className="text-blue-600">+$200M (Overtime Adjust)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '106%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Overhead & Equipment Utilization</span>
                <span className="text-emerald-600">-$200M (9.1% Savings)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90.9%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
