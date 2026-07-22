import { useState } from 'react'
import { Paintbrush, CheckCircle, AlertTriangle, Thermometer, Droplets, Sun, CheckSquare, Layers } from 'lucide-react'

const dftLogs = [
  { id: 'DFT-001', location: 'Bottom Shell - Block A1', specMin: '250 µm', specMax: '300 µm', actualAvg: '275 µm', result: 'pass' as const, coatType: 'Anti-Fouling Topcoat' },
  { id: 'DFT-002', location: 'Side Shell Starboard - Block B2', specMin: '200 µm', specMax: '250 µm', actualAvg: '185 µm', result: 'fail' as const, coatType: 'Epoxy Intermediate' },
  { id: 'DFT-003', location: 'Deck Plate - Block C1', specMin: '150 µm', specMax: '200 µm', actualAvg: '170 µm', result: 'pass' as const, coatType: 'Shop Primer' },
  { id: 'DFT-004', location: 'Engine Room Tank Top', specMin: '300 µm', specMax: '350 µm', actualAvg: '320 µm', result: 'pass' as const, coatType: 'Chemical Resistant Epoxy' },
]

const surfacePrepChecklist = [
  { item: 'Surface Blasting Standard Sa 2.5 achieved', status: true },
  { item: 'Soluble salt contamination test < 50 mg/m²', status: true },
  { item: 'Dust level test Rating 2 or better (ISO 8502-3)', status: true },
  { item: 'Surface profile measurement 50 - 75 µm', status: true },
  { item: 'Ambient temperature > 3°C above dew point', status: true },
  { item: 'Relative humidity below 85%', status: true },
]

export default function PaintingManagement() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Painting & Coating Management</h1>
        <p className="text-sm text-slate-500 font-medium">Dry Film Thickness (DFT) & Environmental Condition Inspection — 300 FT Barge</p>
      </div>

      {/* Environmental Conditions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ambient Temperature', value: '29.5 °C', sub: 'Optimal condition', icon: Thermometer, color: 'text-blue-600' },
          { label: 'Steel Temp (Dew Point)', value: '31.2 °C', sub: '+4.1 °C above dew point', icon: Sun, color: 'text-amber-600' },
          { label: 'Relative Humidity', value: '72 %', sub: 'Target < 85%', icon: Droplets, color: 'text-sky-600' },
          { label: 'Surface Profile', value: 'Sa 2.5', sub: 'ISO 8501-1 verified', icon: Layers, color: 'text-emerald-600' },
        ].map((c, i) => {
          const Icon = c.icon
          return (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">{c.label}</span>
                <Icon size={18} className={c.color} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{c.value}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{c.sub}</p>
            </div>
          )
        })}
      </div>

      {/* DFT Measurement Log */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Paintbrush size={16} className="text-blue-600" /> Dry Film Thickness (DFT) Inspection Log
          </h2>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs">
            + Record DFT Reading
          </button>
        </div>
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>Reading ID</th>
              <th>Inspection Location</th>
              <th>Coating System</th>
              <th>Spec Min</th>
              <th>Spec Max</th>
              <th>Actual Measured DFT</th>
              <th>Compliance Result</th>
            </tr>
          </thead>
          <tbody>
            {dftLogs.map((log) => (
              <tr key={log.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{log.id}</td>
                <td className="font-semibold text-slate-800">{log.location}</td>
                <td className="text-slate-700 font-medium">{log.coatType}</td>
                <td className="text-xs text-slate-500 font-mono">{log.specMin}</td>
                <td className="text-xs text-slate-500 font-mono">{log.specMax}</td>
                <td className="font-bold text-slate-900 font-mono">{log.actualAvg}</td>
                <td>
                  {log.result === 'pass' ? (
                    <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> PASS</span>
                  ) : (
                    <span className="badge badge-danger"><AlertTriangle size={10} className="mr-1" /> RECOAT REQUIRED</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Surface Prep Checklist */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckSquare size={16} className="text-blue-600" /> Surface Preparation Quality Assurance Checklist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {surfacePrepChecklist.map((item, idx) => (
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
