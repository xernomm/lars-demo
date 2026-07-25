import { useState } from 'react'
import {
  BarChart3, TrendingUp, DollarSign, Target, Sparkles, Loader2, Award,
  ShieldCheck, Anchor, Users, FolderKanban, Activity, Calendar, Building2,
  Plus, ShieldAlert, AlertTriangle, CheckCircle2, Clock, Wrench, ChevronDown,
  Info, Filter, Layers, RefreshCw, X
} from 'lucide-react'
import { generateExecutiveSummary } from '../../services/geminiService'
import MarkdownRenderer from '../MarkdownRenderer'

// Dock Data
interface DockItem {
  id: string
  name: string
  type: string
  vesselName: string
  vesselType: string
  status: 'In Use' | 'Maintenance' | 'Available'
  progress: number
  dimensions: string
  estDeparture: string
  manager: string
}

const initialDocks: DockItem[] = [
  {
    id: 'dock-1',
    name: 'Dock 1 — Graving Dock',
    type: 'Dry Graving Dock',
    vesselName: '300 FT Barge #001',
    vesselType: 'New Building (NB)',
    status: 'In Use',
    progress: 82,
    dimensions: '150m x 28m x 7m',
    estDeparture: '15 Sep 2026',
    manager: 'Ir. Budi Santoso',
  },
  {
    id: 'dock-2',
    name: 'Dock 2 — Floating Dock',
    type: 'Floating Drydock 5,000 DWT',
    vesselName: 'MV Ocean Star 5000 DWT',
    vesselType: 'Hull Repair & Shaft Overhaul',
    status: 'In Use',
    progress: 45,
    dimensions: '120m x 24m x 6m',
    estDeparture: '20 Aug 2026',
    manager: 'Capt. Hendra W.',
  },
  {
    id: 'dock-3',
    name: 'Dock 3 — Slipway Ramp A',
    type: 'Mechanical Slipway',
    vesselName: 'TB Bromo 2400 HP',
    vesselType: 'Propeller Maintenance',
    status: 'Maintenance',
    progress: 90,
    dimensions: '80m x 18m',
    estDeparture: '30 Jul 2026',
    manager: 'Ir. Agus Wijaya',
  },
  {
    id: 'dock-4',
    name: 'Dock 4 — Airbag Launching Ramp',
    type: 'Heavy Marine Airbag Ramp',
    vesselName: 'Barge Nusantara 250 FT',
    vesselType: 'Pre-Launch Inspection',
    status: 'Available',
    progress: 0,
    dimensions: '130m x 32m',
    estDeparture: 'Ready for Docking',
    manager: 'Yudi Pratama',
  },
  {
    id: 'dock-5',
    name: 'Dock 5 — Outfitting Berth 1',
    type: 'Deepwater Quay Berth',
    vesselName: 'KM Bahari Express Ferry',
    vesselType: 'HVAC & Electrical Commissioning',
    status: 'In Use',
    progress: 95,
    dimensions: '160m Quay Wall',
    estDeparture: '05 Aug 2026',
    manager: 'Ir. Dewi Kusuma',
  },
]

// Expenses breakdown
const expensesData = [
  { label: 'Material Procurement', amount: '$5.2B', percent: 44.4, color: '#2563eb', bg: 'bg-blue-600' },
  { label: 'Direct Labor & Shift Overtime', amount: '$3.3B', percent: 28.2, color: '#0284c7', bg: 'bg-sky-500' },
  { label: 'Subcontractor Services', amount: '$1.8B', percent: 15.4, color: '#10b981', bg: 'bg-emerald-500' },
  { label: 'Equipment & Machinery', amount: '$1.4B', percent: 12.0, color: '#f59e0b', bg: 'bg-amber-500' },
]

export default function CEODashboard() {
  const [selectedTenant, setSelectedTenant] = useState('PT. Ocean Shipyard (Surabaya Yard)')
  const [dateFilter, setDateFilter] = useState('Year 2026 (YTD)')
  const [dockFilter, setDockFilter] = useState<string>('All')
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showQuickActionModal, setShowQuickActionModal] = useState(false)
  const [selectedDockDetail, setSelectedDockDetail] = useState<DockItem | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Quick Action form state
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

  const filteredDocks = initialDocks.filter((dock) => {
    if (dockFilter === 'All') return true
    return dock.status === dockFilter
  })

  return (
    <div className="space-y-6 fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-slate-700 text-xs font-semibold animate-slide-in-down">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER & TENANT SWITCHER & GLOBAL DATE FILTER */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider">
              Executive View
            </span>
            <span className="text-xs font-semibold text-slate-400">• Multi-Yard Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">CEO Executive Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time Shipbuilding Operations, Multi-Yard Occupancy & Financial Intelligence</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tenant Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <Building2 size={15} className="text-blue-600 flex-shrink-0" />
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="PT. Ocean Shipyard (Surabaya Yard)">PT. Ocean Shipyard (Surabaya Yard)</option>
              <option value="PT. Maritime Shipyard (Batam Yard)">PT. Maritime Shipyard (Batam Yard)</option>
              <option value="PT. Nusantara Dok (Jakarta Yard)">PT. Nusantara Dok (Jakarta Yard)</option>
              <option value="PT. Celebes Shipyard (Makassar Yard)">PT. Celebes Shipyard (Makassar Yard)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <Calendar size={14} className="text-slate-500 flex-shrink-0" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="Year 2026 (YTD)">Year 2026 (YTD)</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="This Month (Jul 2026)">This Month (Jul 2026)</option>
            </select>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => setShowQuickActionModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
          >
            <Plus size={15} /> + Quick Action
          </button>

          {/* AI Executive Summary Button */}
          <button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            title="Generate AI Executive Intelligence Summary"
          >
            {isGenerating ? <Loader2 size={14} className="animate-spin text-emerald-600" /> : <Sparkles size={14} className="text-emerald-600" />}
            {isGenerating ? 'Analyzing...' : 'AI Summary'}
          </button>
        </div>
      </div>

      {/* Generated AI Executive Summary Card */}
      {executiveSummary && (
        <div className="glass-card rounded-2xl p-6 border-2 border-blue-200 bg-blue-50/30 slide-in relative shadow-md">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-blue-200/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Executive AI Operations & Financial Report</h2>
                <p className="text-[11px] text-slate-500 font-medium">Generated live via Gemini 3.5 Flash for {selectedTenant}</p>
              </div>
            </div>
            <button onClick={() => setExecutiveSummary(null)} className="p-1 hover:bg-blue-100 rounded-lg text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          <MarkdownRenderer content={executiveSummary} />
        </div>
      )}

      {/* 2. 5 TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Projects */}
        <div className="glass-card rounded-xl p-4.5 border border-blue-100 bg-gradient-to-b from-white to-blue-50/30 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FolderKanban size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">12 Projects</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> 8 New Build • 4 Repair
          </p>
        </div>

        {/* KPI 2: Project In Progress */}
        <div className="glass-card rounded-xl p-4.5 border border-indigo-100 bg-gradient-to-b from-white to-indigo-50/30 shadow-xs hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Activity size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-indigo-900">8 Projects</p>
          <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> 7 On Schedule • 1 Risk
          </p>
        </div>

        {/* KPI 3: Vessels In Yard */}
        <div className="glass-card rounded-xl p-4.5 border border-sky-100 bg-gradient-to-b from-white to-sky-50/30 shadow-xs hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Vessels In Yard</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Anchor size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-sky-900">6 Vessels</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">
            4 In Dock • 2 Outfitting Quay
          </p>
        </div>

        {/* KPI 4: Total Workers */}
        <div className="glass-card rounded-xl p-4.5 border border-teal-100 bg-gradient-to-b from-white to-teal-50/30 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Workforce</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-teal-900">1,420 Active</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">
            Shift A: 850 • Shift B: 570
          </p>
        </div>

        {/* KPI 5: Total Cost YTD vs Budget Progress */}
        <div className="glass-card rounded-xl p-4.5 border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30 shadow-xs hover:border-emerald-300 transition-all col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">Cost YTD vs Budget</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-xl font-bold text-emerald-900">$11.7B</p>
            <span className="text-[11px] text-slate-400 font-semibold">/ $12.3B</span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>Spent: 95.1%</span>
              <span className="text-emerald-700">+$600M Saved</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95.1%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. VISUAL DOCK & BERTH STATUS WIDGET */}
      <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-2xs">
              <Layers size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Visual Dock & Berth Status (Surabaya Yard)</h2>
              <p className="text-xs text-slate-500 font-medium">Real-time Dock Occupancy, Maintenance Schedules & Vessel Progress</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Filter Dock:</span>
            {['All', 'In Use', 'Maintenance', 'Available'].map((st) => (
              <button
                key={st}
                onClick={() => setDockFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  dockFilter === st
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Dock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredDocks.map((dock) => {
            const isSelected = selectedDockDetail?.id === dock.id
            return (
              <div
                key={dock.id}
                onClick={() => setSelectedDockDetail(dock)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                  dock.status === 'In Use'
                    ? 'bg-gradient-to-b from-white to-blue-50/40 border-blue-200 hover:border-blue-400'
                    : dock.status === 'Maintenance'
                    ? 'bg-gradient-to-b from-white to-amber-50/40 border-amber-200 hover:border-amber-400'
                    : 'bg-gradient-to-b from-white to-emerald-50/30 border-emerald-200 hover:border-emerald-400'
                } ${isSelected ? 'ring-2 ring-blue-600 shadow-md' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-600 truncate">{dock.name}</span>
                    <span
                      className={`badge ${
                        dock.status === 'In Use'
                          ? 'badge-success'
                          : dock.status === 'Maintenance'
                          ? 'badge-warning'
                          : 'badge-info'
                      } text-[9px] uppercase font-bold`}
                    >
                      {dock.status}
                    </span>
                  </div>

                  {/* Vessel Graphics / Box */}
                  <div
                    className={`p-3 rounded-lg border text-center my-2 transition-transform group-hover:scale-[1.02] ${
                      dock.status === 'In Use'
                        ? 'bg-white border-blue-200 shadow-2xs'
                        : dock.status === 'Maintenance'
                        ? 'bg-white border-amber-200 shadow-2xs'
                        : 'bg-white border-slate-200 border-dashed'
                    }`}
                  >
                    <Anchor
                      size={20}
                      className={`mx-auto mb-1 ${
                        dock.status === 'In Use'
                          ? 'text-blue-600'
                          : dock.status === 'Maintenance'
                          ? 'text-amber-600'
                          : 'text-slate-400'
                      }`}
                    />
                    <p className="text-xs font-bold text-slate-900 truncate">{dock.vesselName}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{dock.vesselType}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                      <span>Completion</span>
                      <span className="text-blue-700">{dock.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          dock.status === 'Maintenance' ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${dock.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Est. Exit:</span>
                    <span className="font-bold text-slate-800">{dock.estDeparture}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Dock Modal Detail */}
        {selectedDockDetail && (
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 slide-in flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Anchor size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{selectedDockDetail.name} — {selectedDockDetail.vesselName}</h3>
                  <span className="badge badge-success text-[10px] font-bold">{selectedDockDetail.status}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Type: {selectedDockDetail.vesselType} • Dimensions: {selectedDockDetail.dimensions} • Manager: {selectedDockDetail.manager}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  triggerToast(`Inspection request sent for ${selectedDockDetail.vesselName}`)
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold transition-colors shadow-2xs"
              >
                Request Dock Inspection
              </button>
              <button
                onClick={() => setSelectedDockDetail(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. SAFETY / HSE (K3) TRACKER & QC METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Safety Hero Banner */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-emerald-200 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
            <ShieldCheck size={180} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} /> HSE / K3 Industrial Safety
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">Zero Harm Safety Streak</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-white mt-1">123 DAYS</h2>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Without Lost Time Injury (LTI) across all 5 Shipyard Facilities.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-emerald-200 block text-[11px]">Safety Score</span>
              <span className="font-extrabold text-base text-white">99.4% Pass</span>
            </div>
            <div>
              <span className="text-emerald-200 block text-[11px]">Safe Hours</span>
              <span className="font-extrabold text-base text-white">1,420,000 hrs</span>
            </div>
          </div>
        </div>

        {/* Safety Metrics Breakdown Grid */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Health, Safety & Environment (HSE) & Quality Statistics</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">YTD 2026 Audit Report</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 text-center">
              <span className="text-[11px] font-bold text-emerald-700 block">Lost Time Injury (LTI)</span>
              <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">0 Cases</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Zero Fatalities</span>
            </div>
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 text-center">
              <span className="text-[11px] font-bold text-blue-700 block">Near Miss Events</span>
              <span className="text-2xl font-extrabold text-blue-900 mt-1 block">2 Cases</span>
              <span className="text-[10px] text-blue-600 font-semibold">Investigated & Closed</span>
            </div>
            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/40 text-center">
              <span className="text-[11px] font-bold text-sky-700 block">First Aid Treatments</span>
              <span className="text-2xl font-extrabold text-sky-900 mt-1 block">4 Cases</span>
              <span className="text-[10px] text-sky-600 font-semibold">Minor Scratches</span>
            </div>
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-center">
              <span className="text-[11px] font-bold text-amber-700 block">QC Open NCRs</span>
              <span className="text-2xl font-extrabold text-amber-900 mt-1 block">1 Open</span>
              <span className="text-[10px] text-amber-600 font-semibold">Bulkhead B3 Weld</span>
            </div>
          </div>

          {/* Incident Log Bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="font-semibold text-slate-800">
                Latest HSE ToolBox Talk completed today at 07:00 AM across all yard shops.
              </span>
            </div>
            <button
              onClick={() => {
                setShowQuickActionModal(true)
                setActionType('hse')
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex-shrink-0"
            >
              + Report Incident
            </button>
          </div>
        </div>
      </div>

      {/* 5. FINANCIAL BREAKDOWN & WORK ORDER SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Expenses YTD Chart & Legend */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Top Expenses Breakdown YTD ($11.7B Total)</h2>
            </div>
            <span className="text-xs font-bold text-emerald-600">Cost Savings: $600M</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            {/* Donut Chart Visual SVG */}
            <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3.8" />

                {/* Segment 1: Material (44.4%) */}
                <circle
                  cx="18" cy="18" r="15.915" fill="transparent"
                  stroke="#2563eb" strokeWidth="4"
                  strokeDasharray="44.4 100" strokeDashoffset="0"
                />
                {/* Segment 2: Labor (28.2%) */}
                <circle
                  cx="18" cy="18" r="15.915" fill="transparent"
                  stroke="#0284c7" strokeWidth="4"
                  strokeDasharray="28.2 100" strokeDashoffset="-44.4"
                />
                {/* Segment 3: Subcontract (15.4%) */}
                <circle
                  cx="18" cy="18" r="15.915" fill="transparent"
                  stroke="#10b981" strokeWidth="4"
                  strokeDasharray="15.4 100" strokeDashoffset="-72.6"
                />
                {/* Segment 4: Equipment (12.0%) */}
                <circle
                  cx="18" cy="18" r="15.915" fill="transparent"
                  stroke="#f59e0b" strokeWidth="4"
                  strokeDasharray="12.0 100" strokeDashoffset="-88.0"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400">Total YTD</span>
                <span className="text-base font-extrabold text-slate-900">$11.7B</span>
              </div>
            </div>

            {/* Expenses Legend */}
            <div className="flex-1 space-y-2.5 w-full">
              {expensesData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.bg}`} />
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">{item.amount}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Work Order Summary Widget */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Wrench size={18} className="text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Work Order Summary (342 Total WOs)</h2>
            </div>
            <button
              onClick={() => {
                setShowQuickActionModal(true)
                setActionType('wo')
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              + New WO
            </button>
          </div>

          <div className="space-y-3.5 pt-1">
            {[
              { label: 'Completed WOs', count: 245, percent: '71.6%', color: 'bg-emerald-500', textColor: 'text-emerald-700' },
              { label: 'In Progress WOs', count: 68, percent: '19.9%', color: 'bg-blue-600', textColor: 'text-blue-700' },
              { label: 'Open / Scheduled WOs', count: 18, percent: '5.3%', color: 'bg-sky-400', textColor: 'text-sky-700' },
              { label: 'On Hold / Pending QA', count: 11, percent: '3.2%', color: 'bg-amber-500', textColor: 'text-amber-700' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.count} WOs</span>
                    <span className={`font-bold text-[11px] ${item.textColor}`}>({item.percent})</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTION MODAL */}
      {showQuickActionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setShowQuickActionModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-2xl animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus size={18} className="text-blue-600" /> Executive Quick Action
              </h3>
              <button onClick={() => setShowQuickActionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleQuickActionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Action Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'project', label: 'New Project' },
                    { id: 'wo', label: 'Work Order' },
                    { id: 'hse', label: 'HSE Report' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActionType(t.id)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                        actionType === t.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title / Description</label>
                <input
                  type="text"
                  required
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
                  placeholder={
                    actionType === 'project'
                      ? 'e.g. 5000 DWT Container Vessel #005'
                      : actionType === 'wo'
                      ? 'e.g. Engine Room Piping Weld Repair'
                      : 'e.g. Near Miss Oil Spill at Slipway A'
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Facility / Dock</label>
                <select
                  value={actionTargetYard}
                  onChange={(e) => setActionTargetYard(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Dock 1 — Graving Dock">Dock 1 — Graving Dock</option>
                  <option value="Dock 2 — Floating Dock">Dock 2 — Floating Dock</option>
                  <option value="Dock 3 — Slipway Ramp A">Dock 3 — Slipway Ramp A</option>
                  <option value="Dock 4 — Airbag Ramp">Dock 4 — Airbag Ramp</option>
                  <option value="Dock 5 — Outfitting Berth 1">Dock 5 — Outfitting Berth 1</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickActionModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Submit & Execute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
