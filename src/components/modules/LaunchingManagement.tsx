import { useState } from 'react'
import { Rocket, CheckCircle, AlertTriangle, ShieldCheck, Activity, Scale, Compass } from 'lucide-react'

const safetyChecklist = [
  { item: 'Marine Airbag pressure testing (0.25 MPa verified)', status: true },
  { item: 'Slipway slope inclination check (1:20 grade verified)', status: true },
  { item: 'Tide level & water depth calculation at launching dock', status: true },
  { item: 'Winch release brake mechanism & emergency stop test', status: true },
  { item: 'Vessel transverse & longitudinal stability GM calculation', status: true },
  { item: 'Clearance of launching channel & tugboat standby readiness', status: true },
]

export default function LaunchingManagement() {
  const [airbagPressure, setAirbagPressure] = useState('0.25')
  const [tideHeight, setTideHeight] = useState('3.2')
  const [calcStatus, setCalcStatus] = useState<'safe' | 'warning'>('safe')

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Launching Management</h1>
        <p className="text-sm text-slate-500 font-medium">Airbag & Slipway Vessel Launching Calculations — 300 FT Barge</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Selected Launch Method', value: 'Marine Airbag', color: 'text-blue-600' },
          { label: 'Safety Index', value: '100% PASS', color: 'text-emerald-600' },
          { label: 'Tide Requirement', value: 'Min 2.8 Meters', color: 'text-sky-600' },
          { label: 'Target Launching Date', value: '15 Sep 2026', color: 'text-indigo-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Interactive Calculator */}
      <div className="glass-card rounded-xl p-5 border-2 border-blue-100">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Scale size={16} className="text-blue-600" /> Launching Parameter & Stability Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Airbag Working Pressure (MPa)</label>
            <input
              type="number"
              step="0.01"
              value={airbagPressure}
              onChange={(e) => setAirbagPressure(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">High Tide Water Level (Meters)</label>
            <input
              type="number"
              step="0.1"
              value={tideHeight}
              onChange={(e) => setTideHeight(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <div className={`w-full p-2.5 rounded-lg border flex items-center justify-between ${
              calcStatus === 'safe' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-600" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider">Calculated Status</p>
                  <p className="text-xs font-bold">LAUNCHING STATUS: SAFE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Checklist */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-600" /> Pre-Launching Safety & Operational Checklist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {safetyChecklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
              <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800">{item.item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
