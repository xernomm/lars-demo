import { useState } from 'react'
import { BarChart3, DollarSign, TrendingUp, Shield, Sparkles, Loader2, Users, Activity } from 'lucide-react'
import { generateExecutiveSummary } from '../../services/geminiService'
import MarkdownRenderer from '../MarkdownRenderer'

export default function CEODashboard() {
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateSummary = async () => {
    setIsLoading(true)
    try {
      const result = await generateExecutiveSummary()
      setAiSummary(result)
    } catch {
      setAiSummary('⚠️ Gagal menghasilkan ringkasan. Silakan coba lagi.')
    }
    setIsLoading(false)
  }

  const progress = 82
  const circumference = 2 * Math.PI * 70
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`

  const costData = [
    { label: 'Material', planned: 5.2, actual: 4.8 },
    { label: 'Labor', planned: 3.1, actual: 3.3 },
    { label: 'Equipment', planned: 2.0, actual: 1.8 },
    { label: 'Overhead', planned: 1.2, actual: 1.1 },
    { label: 'Contingency', planned: 0.8, actual: 0.7 },
  ]
  const maxCost = 5.5

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <BarChart3 size={28} className="text-blue-600" />
            CEO Dashboard
          </h1>
          <p className="text-sm text-slate-500 font-medium">Ringkasan Eksekutif — Barge 300 FT #001</p>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-bold hover:from-blue-500 hover:to-cyan-400 transition-all shadow-xs disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {isLoading ? 'Menghasilkan...' : 'AI Executive Summary'}
        </button>
      </div>

      {/* Executive Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget', value: '$12.3B', sub: 'Rp 190.6T', icon: DollarSign, color: 'bg-blue-50/60 border-blue-200', iconColor: 'text-blue-600', valColor: 'text-blue-900' },
          { label: 'Cost Aktual', value: '$11.7B', sub: 'Under budget 4.9%', icon: TrendingUp, color: 'bg-emerald-50/60 border-emerald-200', iconColor: 'text-emerald-600', valColor: 'text-emerald-900' },
          { label: 'Safety Record', value: '450 Hari', sub: 'Tanpa kecelakaan', icon: Shield, color: 'bg-amber-50/60 border-amber-200', iconColor: 'text-amber-600', valColor: 'text-amber-900' },
          { label: 'Workforce', value: '342', sub: 'Personel aktif', icon: Users, color: 'bg-purple-50/60 border-purple-200', iconColor: 'text-purple-600', valColor: 'text-purple-900' },
        ].map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className={`glass-card rounded-xl p-5 border ${card.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">{card.label}</span>
                <Icon size={18} className={card.iconColor} />
              </div>
              <p className={`text-2xl font-bold ${card.valColor}`}>{card.value}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">{card.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Progress Chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blue-600" />
            Progress Keseluruhan Proyek
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="70" fill="none" stroke="#e2e8f0" strokeWidth="14" />
                <circle
                  cx="90" cy="90" r="70" fill="none"
                  stroke="url(#progressGradientLight)" strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  transform="rotate(-90 90 90)"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="progressGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">{progress}%</span>
                <span className="text-xs font-semibold text-slate-500">Selesai</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Tepat Waktu', value: '94%', color: 'text-emerald-600' },
              { label: 'Sisa Waktu', value: '5 bulan', color: 'text-blue-600' },
              { label: 'Efisiensi', value: '91%', color: 'text-purple-600' },
              { label: 'Quality Score', value: '97.5%', color: 'text-amber-600' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
                <p className="text-[10px] font-semibold text-slate-500">{item.label}</p>
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost vs Forecast Bar Chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-blue-600" />
            Cost vs Forecast (Miliar $)
          </h3>
          <div className="space-y-4">
            {costData.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  <span className="text-[10px] font-medium text-slate-500">
                    Plan: ${item.planned}B | Act: ${item.actual}B
                  </span>
                </div>
                <div className="flex gap-1 h-6">
                  <div className="flex-1 relative bg-slate-100 rounded overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-0 bg-blue-200 rounded" style={{ width: `${(item.planned / maxCost) * 100}%` }}>
                      <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500" />
                    </div>
                    <div className={`absolute top-0.5 bottom-0.5 left-0 rounded ${item.actual <= item.planned ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${(item.actual / maxCost) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-blue-200 border-r-2 border-blue-500" />
              <span className="text-[10px] font-semibold text-slate-600">Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-emerald-500" />
              <span className="text-[10px] font-semibold text-slate-600">Aktual (Under)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-red-500" />
              <span className="text-[10px] font-semibold text-slate-600">Aktual (Over)</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-600" />
              <span className="text-xs text-emerald-800 font-bold">Total Variance: -$0.6B (4.9% Under Budget)</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">KPI Operasional</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Welding Defect Rate', value: '2.1%', target: '< 3%', ok: true },
            { label: 'DFT Compliance', value: '98.5%', target: '> 95%', ok: true },
            { label: 'Material Utilization', value: '94.2%', target: '> 90%', ok: true },
            { label: 'Worker Productivity', value: '91%', target: '> 85%', ok: true },
          ].map((kpi, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-slate-500 mb-1">{kpi.label}</p>
              <p className={`text-lg font-bold ${kpi.ok ? 'text-emerald-600' : 'text-red-600'}`}>{kpi.value}</p>
              <p className="text-[10px] font-medium text-slate-400">Target: {kpi.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      {(isLoading || aiSummary) && (
        <div className="glass-card rounded-xl p-5 border border-blue-200 bg-blue-50/20 slide-in">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-blue-100">
            <Sparkles size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Eksekutif AI</h3>
            {isLoading && <Loader2 size={14} className="text-blue-600 animate-spin" />}
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span>Gemini AI sedang menyusun ringkasan eksekutif...</span>
            </div>
          ) : (
            <MarkdownRenderer content={aiSummary || ''} />
          )}
        </div>
      )}
    </div>
  )
}
