import { useState } from 'react'
import {
  BarChart3, TrendingUp, DollarSign, Sparkles, Loader2,
  ShieldCheck, Anchor, Users, FolderKanban, Activity, Calendar, Building2,
  Plus, CheckCircle2, Clock, Wrench, ChevronDown,
  Layers, X, Ship, CircleDot, Eye, MoreVertical, ChevronRight,
  AlertTriangle, FileText, ArrowUpRight, Radio, Globe, Navigation, ExternalLink
} from 'lucide-react'
import { generateExecutiveSummary } from '../../services/geminiService'
import MarkdownRenderer from '../MarkdownRenderer'

/* ─── Dock Data ─── */
interface DockItem {
  id: string
  name: string
  shortName: string
  status: 'In Use' | 'Maintenance' | 'Available'
  vesselName: string
  progress: number
  vesselType: string
  dimensions: string
  estDeparture: string
  manager: string
}

const docks: DockItem[] = [
  { id: 'dock-1', name: 'Dock 1 — Graving Dock', shortName: 'Dock 1', status: 'In Use', vesselName: '300 FT Barge #001', progress: 82, vesselType: 'New Building', dimensions: '150m x 28m x 7m', estDeparture: '15 Sep 2026', manager: 'Ir. Budi Santoso' },
  { id: 'dock-2', name: 'Dock 2 — Floating Dock', shortName: 'Dock 2', status: 'In Use', vesselName: 'MV Ocean Star', progress: 45, vesselType: 'Hull Repair', dimensions: '120m x 24m x 6m', estDeparture: '20 Aug 2026', manager: 'Capt. Hendra W.' },
  { id: 'dock-3', name: 'Dock 3 — Slipway A', shortName: 'Dock 3', status: 'Maintenance', vesselName: 'TB Bromo 2400 HP', progress: 90, vesselType: 'Propeller Maintenance', dimensions: '80m x 18m', estDeparture: '30 Jul 2026', manager: 'Ir. Agus Wijaya' },
  { id: 'dock-4', name: 'Dock 4 — Airbag Ramp', shortName: 'Dock 4', status: 'Available', vesselName: 'Barge Nusantara 250 FT', progress: 0, vesselType: 'Pre-Launch Inspection', dimensions: '130m x 32m', estDeparture: 'Ready', manager: 'Yudi Pratama' },
  { id: 'dock-5', name: 'Dock 5 — Outfitting Berth', shortName: 'Dock 5', status: 'In Use', vesselName: 'KM Bahari Express', progress: 95, vesselType: 'HVAC Commissioning', dimensions: '160m Quay Wall', estDeparture: '05 Aug 2026', manager: 'Ir. Dewi Kusuma' },
]

/* ─── Active Projects Data ─── */
const activeProjects = [
  { code: 'NB-2024-001', vessel: 'MV Ocean Pioneer', type: 'New Building', client: 'Oceanic Shipping', progress: 72, schedule: '15 Nov 2024', status: 'In Progress' },
  { code: 'REP-2024-003', vessel: 'MT Pacific Trader', type: 'Repair', client: 'Pacific Marine', progress: 58, schedule: '30 May 2024', status: 'In Progress' },
  { code: 'CON-2024-002', vessel: 'MV Coastal Explorer', type: 'Conversion', client: 'Global Offshore', progress: 40, schedule: '20 Jul 2024', status: 'On Hold' },
  { code: 'DOC-2024-004', vessel: 'MV Atlantic Star', type: 'Docking', client: 'Atlantic Lines', progress: 85, schedule: '05 Jun 2024', status: 'In Progress' },
  { code: 'NB-2024-005', vessel: 'MV Future Wave', type: 'New Building', client: 'Future Logistics', progress: 20, schedule: '10 Dec 2024', status: 'Delayed' },
]

/* ─── Expenses Data ─── */
const expensesData = [
  { label: 'Material', pct: 40, amount: 'USD 9.82M', color: '#1e3a5f' },
  { label: 'Labor', pct: 30, amount: 'USD 7.37M', color: '#2563eb' },
  { label: 'Subcontract', pct: 15, amount: 'USD 3.68M', color: '#10b981' },
  { label: 'Equipment', pct: 10, amount: 'USD 2.46M', color: '#f59e0b' },
  { label: 'Others', pct: 5, amount: 'USD 1.23M', color: '#94a3b8' },
]

/* ─── Project Progress (by type) ─── */
const progressByType = [
  { label: 'New Building', pct: 72, color: '#2563eb' },
  { label: 'Repair', pct: 58, color: '#0284c7' },
  { label: 'Conversion', pct: 40, color: '#10b981' },
  { label: 'Docking', pct: 85, color: '#1e3a5f' },
]

/* ─── Project Status (for donut) ─── */
const projectStatusData = [
  { label: 'Completed', count: 4, pct: 22, color: '#10b981' },
  { label: 'In Progress', count: 7, pct: 39, color: '#2563eb' },
  { label: 'On Hold', count: 3, pct: 17, color: '#f59e0b' },
  { label: 'Delayed', count: 4, pct: 22, color: '#ef4444' },
]

export default function CEODashboard() {
  const [selectedTenant, setSelectedTenant] = useState('PT. Ocean Shipyard')
  const [dateFilter, setDateFilter] = useState('01 – 31 May 2024')
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showQuickActionModal, setShowQuickActionModal] = useState(false)
  const [selectedDock, setSelectedDock] = useState<DockItem | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [actionType, setActionType] = useState('project')
  const [actionTitle, setActionTitle] = useState('')
  const [actionTargetYard, setActionTargetYard] = useState('Dock 1')

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

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleQuickActionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!actionTitle) return
    const actionLabel = actionType === 'project' ? 'New Project' : actionType === 'wo' ? 'Work Order' : 'HSE Incident'
    triggerToast(`✅ ${actionLabel} "${actionTitle}" successfully created for ${actionTargetYard}!`)
    setShowQuickActionModal(false)
    setActionTitle('')
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      'In Progress': 'bg-blue-100 text-blue-700',
      'On Hold': 'bg-amber-100 text-amber-700',
      'Delayed': 'bg-red-100 text-red-700',
      'Completed': 'bg-emerald-100 text-emerald-700',
    }
    return map[status] || 'bg-slate-100 text-slate-600'
  }

  const dockBadge = (status: string) => {
    if (status === 'In Use') return 'bg-blue-600 text-white'
    if (status === 'Maintenance') return 'bg-amber-500 text-white'
    return 'bg-emerald-500 text-white'
  }

  /* ─── SVG Donut helper ─── */
  const renderDonut = (data: { pct: number; color: string }[], size = 120, stroke = 10) => {
    const r = (size - stroke) / 2
    const c = 2 * Math.PI * r
    let offset = 0
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="transparent" stroke="#f1f5f9" strokeWidth={stroke} />
        {data.map((d, i) => {
          const dash = (d.pct / 100) * c
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="transparent"
              stroke={d.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          )
          offset += dash
          return el
        })}
      </svg>
    )
  }

  return (
    <div className="space-y-4 fade-in" style={{ fontSize: '13px' }}>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-14 right-5 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl z-50 flex items-center gap-2 text-xs font-medium" style={{ animation: 'slideInUp 0.3s ease-out' }}>
          <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── HEADER BAR ─── */}
      <div className="bg-white rounded-xl px-5 py-3 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Overview of shipyard operations and projects</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tenant Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-slate-300 transition-colors">
            <Building2 size={13} className="text-slate-500" />
            <select value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer">
              <option>PT. Ocean Shipyard</option>
              <option>PT. Maritime Shipyard</option>
              <option>PT. Nusantara Dok</option>
              <option>PT. Celebes Shipyard</option>
            </select>
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-slate-300 transition-colors">
            <Calendar size={13} className="text-slate-500" />
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer">
              <option>01 – 31 May 2024</option>
              <option>Q3 2026</option>
              <option>Q2 2026</option>
              <option>YTD 2026</option>
            </select>
          </div>

          {/* Quick Action */}
          <button onClick={() => setShowQuickActionModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm">
            <Plus size={13} /> Quick Action
          </button>

          {/* AI Summary */}
          <button onClick={handleGenerateSummary} disabled={isGenerating}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
            {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            {isGenerating ? 'Analyzing...' : 'AI Summary'}
          </button>
        </div>
      </div>

      {/* AI Summary Panel */}
      {executiveSummary && (
        <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200 slide-in relative">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-200/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center"><Sparkles size={13} /></div>
              <div>
                <h2 className="text-xs font-bold text-slate-900">Executive AI Summary</h2>
                <p className="text-[10px] text-slate-500">Generated for {selectedTenant}</p>
              </div>
            </div>
            <button onClick={() => setExecutiveSummary(null)} className="p-1 hover:bg-blue-100 rounded text-slate-400 hover:text-slate-600"><X size={14} /></button>
          </div>
          <MarkdownRenderer content={executiveSummary} />
        </div>
      )}

      {/* ─── KPI CARDS ROW ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'TOTAL PROJECTS', value: '18', sub: 'Active Projects', trend: '↑ 3 from last month', icon: FolderKanban, iconBg: 'bg-blue-600' },
          { label: 'PROJECT IN PROGRESS', value: '7', sub: 'Projects', trend: '↑ 2 from last month', icon: Activity, iconBg: 'bg-indigo-600' },
          { label: 'Vessels In Yard', value: '6', sub: 'Vessels', trend: '↑ 1 from last month', icon: Anchor, iconBg: 'bg-sky-600' },
          { label: 'TOTAL WORKERS', value: '342', sub: 'Workers', trend: '↑ 15 from last month', icon: Users, iconBg: 'bg-teal-600' },
          { label: 'TOTAL COST (YTD)', value: 'USD 24,560,000', sub: 'of USD 32,000,000 Budget', trend: null, icon: DollarSign, iconBg: 'bg-emerald-600', budget: 76.8 },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">{kpi.label}</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{kpi.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{kpi.sub}</p>
              </div>
              <div className={`w-9 h-9 rounded-full ${kpi.iconBg} text-white flex items-center justify-center flex-shrink-0 ml-2`}>
                <kpi.icon size={16} />
              </div>
            </div>
            {kpi.trend && (
              <p className="text-[10px] text-emerald-600 font-semibold mt-2 flex items-center gap-0.5">
                <TrendingUp size={10} /> {kpi.trend}
              </p>
            )}
            {kpi.budget && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-slate-500">Budget Used</span>
                  <span className="font-bold text-blue-700">{kpi.budget}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${kpi.budget}%` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── ROW 2: Project Progress Overview + Project Progress Bars + Dock Status ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Project Progress Donut */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Project Progress Overview</h3>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {renderDonut(projectStatusData.map(d => ({ pct: d.pct, color: d.color })), 110, 12)}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-slate-900">18</span>
                <span className="text-[9px] text-slate-500">Total Projects</span>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {projectStatusData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600 flex-1">{d.label}</span>
                  <span className="font-bold text-slate-800">{d.count} ({d.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Progress Bars */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Project Progress</h3>
          <div className="space-y-3">
            {progressByType.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">{p.label}</span>
                  <span className="font-bold text-slate-900">{p.pct}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                </div>
              </div>
            ))}
          </div>
          {/* Progress Legend */}
          <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-100">
            <div className="h-1.5 bg-slate-200 rounded-full flex-1 overflow-hidden flex">
              <div style={{ width: '22%', background: '#10b981' }} />
              <div style={{ width: '39%', background: '#2563eb' }} />
              <div style={{ width: '17%', background: '#f59e0b' }} />
              <div style={{ width: '22%', background: '#ef4444' }} />
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
            {[{ l: 'Completed', c: '#10b981' }, { l: 'In Progress', c: '#2563eb' }, { l: 'On Hold', c: '#f59e0b' }, { l: 'Delayed', c: '#ef4444' }].map((x, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: x.c }} /> {x.l}
              </span>
            ))}
          </div>
        </div>

        {/* Dock & Berth Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Dock & Berth Status</h3>
          </div>
          {/* Visual dock strip */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg p-3 relative overflow-hidden mb-3">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23ffffff08%22%2F%3E%3C%2Fsvg%3E')] opacity-30" />
            <div className="flex gap-2 relative z-10">
              {docks.map(d => (
                <button key={d.id} onClick={() => setSelectedDock(d)}
                  className={`flex-1 rounded-md py-2 px-1 text-center transition-all border ${
                    d.status === 'In Use' ? 'bg-blue-600/80 border-blue-400/60' :
                    d.status === 'Maintenance' ? 'bg-amber-600/80 border-amber-400/60' :
                    'bg-emerald-600/80 border-emerald-400/60'
                  } hover:brightness-110`}>
                  <p className="text-[9px] font-bold text-white/90 leading-tight">{d.shortName}</p>
                  <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[7px] font-bold ${dockBadge(d.status)}`}>
                    {d.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
            View Dock Schedule <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* ─── MARINETRAFFIC LIVE AIS FLEET RADAR ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-xl p-4 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Radio size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">MarineTraffic Live AIS Fleet Radar</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-400/30">
                  Live Satellite AIS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <Globe size={12} className="text-blue-400" />
                Integrated MarineTraffic.com Telemetry — 5 Active Yard Vessels Tracked
              </p>
            </div>
          </div>

          <a
            href="https://www.marinetraffic.com/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            Open MarineTraffic.com <ExternalLink size={12} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Sea Trial Vessel</span>
              <span className="text-purple-300 font-bold bg-purple-900/40 px-1.5 py-0.5 rounded border border-purple-500/30">Sea Trial Zone</span>
            </div>
            <p className="font-bold text-sm text-white mt-1">MV Ocean Pioneer</p>
            <p className="text-[11px] text-slate-300 mt-1">Speed: <strong className="text-emerald-400">14.2 kn</strong> | MMSI: 525019882</p>
            <p className="text-[10px] text-slate-400 mt-1">ETA Quay: Today 22:00 UTC</p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Inbound Drydock</span>
              <span className="text-amber-300 font-bold bg-amber-900/40 px-1.5 py-0.5 rounded border border-amber-500/30">Approaching</span>
            </div>
            <p className="font-bold text-sm text-white mt-1">MT Pacific Trader</p>
            <p className="text-[11px] text-slate-300 mt-1">Status: <strong>At Anchorage B</strong> | MMSI: 525088194</p>
            <p className="text-[10px] text-slate-400 mt-1">ETA Dock 2: 08 Aug 08:30 UTC</p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>MarineTraffic OpenAPI</span>
                <span className="text-blue-300 font-bold">v0.0.1</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 font-medium">
                Live AIS positions, vessel specs, and expected port arrival telemetry.
              </p>
            </div>
            <p className="text-[11px] text-blue-400 font-bold flex items-center gap-1 mt-2">
              <Navigation size={12} /> MarineTraffic Radar Active
            </p>
          </div>
        </div>
      </div>


      {/* ─── ROW 3: Active Projects Table ─── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Active Projects</h3>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors">
            View All Projects <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Project / Vessel</th>
                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Type</th>
                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Client</th>
                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Progress</th>
                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Schedule</th>
                <th className="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-2 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {activeProjects.map((p, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Ship size={14} className="text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{p.code}</p>
                        <p className="text-[10px] text-slate-500">{p.vessel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">{p.type}</td>
                  <td className="px-3 py-2.5 text-slate-700">{p.client}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">{p.schedule}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── ROW 4: Work Order Summary + Top Expenses + Safety Overview ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Work Order Summary */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Work Order Summary</h3>
            <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Total Work Orders', icon: FileText, count: 128, color: 'text-slate-600', iconColor: 'text-blue-600' },
              { label: 'Open', icon: CircleDot, count: 45, color: 'text-amber-600', iconColor: 'text-amber-500' },
              { label: 'In Progress', icon: Clock, count: 52, color: 'text-blue-600', iconColor: 'text-blue-500' },
              { label: 'Completed', icon: CheckCircle2, count: 21, color: 'text-emerald-600', iconColor: 'text-emerald-500' },
              { label: 'On Hold', icon: AlertTriangle, count: 10, color: 'text-red-600', iconColor: 'text-red-500' },
            ].map((wo, i) => (
              <div key={i} className={`flex items-center justify-between py-1.5 ${i === 0 ? 'pb-2.5 mb-1 border-b border-slate-100' : ''}`}>
                <div className="flex items-center gap-2">
                  <wo.icon size={13} className={wo.iconColor} />
                  <span className="text-xs text-slate-700">{wo.label}</span>
                </div>
                <span className={`text-sm font-bold ${i === 0 ? 'text-slate-900' : wo.color}`}>{wo.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Expenses (YTD) — Donut */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Top Expenses (YTD)</h3>
            <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-800">View Report</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {renderDonut(expensesData.map(d => ({ pct: d.pct, color: d.color })), 110, 14)}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[9px] text-slate-400 font-semibold">USD</span>
                <span className="text-sm font-bold text-slate-900">24.56M</span>
                <span className="text-[9px] text-slate-400">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {expensesData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600 flex-1">{d.label}</span>
                  <span className="font-semibold text-slate-500">{d.pct}%</span>
                  <span className="font-bold text-slate-800 text-right w-20">{d.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Overview */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Safety Overview</h3>
            <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-800">View Report</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Days Without LTI */}
            <div className="col-span-2 flex items-center gap-3 pb-3 mb-1 border-b border-slate-100">
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-medium">Days Without Lost Time Injury</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-bold text-blue-700">123</span>
                  <span className="text-xs text-slate-500">Days</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} className="text-emerald-600" />
              </div>
            </div>
            {/* Metrics */}
            {[
              { label: 'Total Incidents (YTD)', value: 8 },
              { label: 'Near Miss', value: 15 },
              { label: 'First Aid Case', value: 6 },
              { label: 'Lost Time Injury', value: 0 },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{m.label}</span>
                <span className={`text-sm font-bold ${m.value === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── ROW 5: Gantt Preview + QC Inspection ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Project Schedule (Gantt Overview) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Project Schedule (Gantt Overview)</h3>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5">View Full Gantt <ArrowUpRight size={11} /></button>
          </div>
          {/* Gantt mini chart */}
          <div className="space-y-0">
            {/* Header row */}
            <div className="grid gap-0" style={{ gridTemplateColumns: '180px 1fr' }}>
              <div className="text-[10px] font-semibold text-slate-500 py-1.5 px-2 border-b border-slate-100">Project</div>
              <div className="flex border-b border-slate-100">
                {['May 2024', 'Jun 2024'].map(m => (
                  <div key={m} className="flex-1 text-center text-[10px] font-semibold text-slate-400 py-1.5 border-l border-slate-100">{m}</div>
                ))}
              </div>
            </div>
            {/* Week markers header */}
            <div className="grid gap-0" style={{ gridTemplateColumns: '180px 1fr' }}>
              <div />
              <div className="flex">
                {['W18', 'W19', 'W20', 'W21', 'W22', 'W23', 'W24', 'W25', 'W26', 'W27'].map(w => (
                  <div key={w} className="flex-1 text-center text-[8px] text-slate-400 py-1 border-l border-slate-50">{w}</div>
                ))}
              </div>
            </div>
            {/* Project bars */}
            {[
              { name: 'MV Ocean Pioneer (NB-2024-001)', start: 2, width: 4, color: '#2563eb' },
              { name: 'MT Pacific Trader (REP-2024-003)', start: 3, width: 3, color: '#0284c7' },
              { name: 'MV Coastal Explorer (CON-2024-002)', start: 1, width: 6, color: '#ef4444' },
              { name: 'MV Atlantic Star (DOC-2024-004)', start: 0, width: 5, color: '#10b981' },
            ].map((bar, i) => (
              <div key={i} className="grid gap-0 border-b border-slate-50" style={{ gridTemplateColumns: '180px 1fr' }}>
                <div className="text-[10px] text-slate-700 py-2 px-2 truncate font-medium">{bar.name}</div>
                <div className="relative py-2 flex items-center">
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <div key={j} className="flex-1 border-l border-slate-50" />
                    ))}
                  </div>
                  <div
                    className="relative h-3.5 rounded-sm"
                    style={{
                      marginLeft: `${(bar.start / 10) * 100}%`,
                      width: `${(bar.width / 10) * 100}%`,
                      backgroundColor: bar.color,
                    }}
                  />
                </div>
              </div>
            ))}
            {/* Today marker text */}
            <div className="grid gap-0" style={{ gridTemplateColumns: '180px 1fr' }}>
              <div />
              <div className="relative">
                <span className="absolute text-[9px] text-red-500 font-bold" style={{ left: '45%' }}>▲ Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* QC Inspection Overview */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">QC Inspection Overview</h3>
            <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="flex items-center gap-4">
            {/* QC Donut */}
            <div className="relative flex-shrink-0">
              {renderDonut([
                { pct: 73, color: '#10b981' },
                { pct: 18, color: '#f59e0b' },
                { pct: 9, color: '#ef4444' },
              ], 100, 12)}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-emerald-700">73%</span>
                <span className="text-[8px] text-slate-500">Pass Rate</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Total Inspections</span>
                  <span className="font-bold text-slate-900">256</span>
                </div>
              </div>
              {[
                { label: 'Passed', value: '187 (73%)', color: 'text-emerald-600' },
                { label: 'Minor NCR', value: '45 (18%)', color: 'text-amber-600' },
                { label: 'Major NCR', value: '24 (9%)', color: 'text-red-600' },
              ].map((q, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-slate-600">{q.label}</span>
                  <span className={`font-bold ${q.color}`}>{q.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── DOCK DETAIL POPUP ─── */}
      {selectedDock && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDock(null)}>
          <div className="bg-white rounded-xl p-5 w-full max-w-md border border-slate-200 shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ animation: 'slideInUp 0.25s ease-out' }}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center"><Anchor size={16} /></div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedDock.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${dockBadge(selectedDock.status)}`}>{selectedDock.status}</span>
                </div>
              </div>
              <button onClick={() => setSelectedDock(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { l: 'Vessel', v: selectedDock.vesselName },
                { l: 'Type', v: selectedDock.vesselType },
                { l: 'Dimensions', v: selectedDock.dimensions },
                { l: 'Manager', v: selectedDock.manager },
                { l: 'Est. Departure', v: selectedDock.estDeparture },
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">{row.l}</span>
                  <span className="font-semibold text-slate-800">{row.v}</span>
                </div>
              ))}
              <div className="pt-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Completion</span>
                  <span className="font-bold text-blue-700">{selectedDock.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedDock.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
              <button onClick={() => { triggerToast(`Inspection request sent for ${selectedDock.vesselName}`); setSelectedDock(null) }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors">
                Request Inspection
              </button>
              <button onClick={() => setSelectedDock(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── QUICK ACTION MODAL ─── */}
      {showQuickActionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowQuickActionModal(false)}>
          <div className="bg-white rounded-xl p-5 w-full max-w-md border border-slate-200 shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ animation: 'slideInUp 0.25s ease-out' }}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus size={15} className="text-blue-600" /> Quick Action
              </h3>
              <button onClick={() => setShowQuickActionModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleQuickActionSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Action Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'project', label: 'New Project' },
                    { id: 'wo', label: 'Work Order' },
                    { id: 'hse', label: 'HSE Report' },
                  ].map((t) => (
                    <button key={t.id} type="button" onClick={() => setActionType(t.id)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        actionType === t.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Title / Description</label>
                <input type="text" required value={actionTitle} onChange={(e) => setActionTitle(e.target.value)}
                  placeholder={actionType === 'project' ? 'e.g. 5000 DWT Container Vessel' : actionType === 'wo' ? 'e.g. Engine Room Piping Repair' : 'e.g. Near Miss at Slipway A'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Facility</label>
                <select value={actionTargetYard} onChange={(e) => setActionTargetYard(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500">
                  {docks.map(d => <option key={d.id} value={d.shortName}>{d.name}</option>)}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowQuickActionModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
