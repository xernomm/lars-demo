import { useState } from 'react'
import { Rocket, CheckSquare, Square, Calculator, Shield } from 'lucide-react'

const safetyChecklist = [
  { id: 1, item: 'Perhitungan stabilitas peluncuran disetujui', checked: true },
  { id: 2, item: 'Jalur peluncuran (slipway/airbag) diperiksa', checked: true },
  { id: 3, item: 'Semua lubang lambung ditutup dan kedap', checked: true },
  { id: 4, item: 'Peralatan towing sudah siap', checked: false },
  { id: 5, item: 'Tim penyelam standby', checked: false },
  { id: 6, item: 'Kondisi cuaca dan pasang surut diverifikasi', checked: false },
  { id: 7, item: 'Persetujuan surveyor BKI diperoleh', checked: false },
  { id: 8, item: 'Area peluncuran steril dari personel tidak berkepentingan', checked: true },
  { id: 9, item: 'Komunikasi radio antar tim terpasang', checked: true },
  { id: 10, item: 'Peralatan P3K dan rescue boat siap', checked: false },
]

export default function LaunchingManagement() {
  const [method, setMethod] = useState<'airbag' | 'slipway'>('airbag')
  const [checklist, setChecklist] = useState(safetyChecklist)
  const [calcResult, setCalcResult] = useState<any>(null)

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  const runCalculation = () => {
    setCalcResult({
      displacement: '3,250 ton',
      draft: '3.8 m',
      buoyancy: '3,340 ton',
      gm: '1.2 m',
      launchAngle: method === 'slipway' ? '4.5°' : 'N/A',
      airbagCount: method === 'airbag' ? '28 unit' : 'N/A',
      airbagPressure: method === 'airbag' ? '0.12 MPa' : 'N/A',
      tideRequired: '> 4.0 m',
      status: 'AMAN',
    })
  }

  const completedChecks = checklist.filter(c => c.checked).length

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Rocket size={28} className="text-blue-600" />
          Launching Management
        </h1>
        <p className="text-sm text-slate-500 font-medium">Manajemen Peluncuran Kapal</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Metode', value: method === 'airbag' ? 'Airbag' : 'Slipway', color: 'text-blue-600' },
          { label: 'Safety Checklist', value: `${completedChecks}/${checklist.length}`, color: completedChecks === checklist.length ? 'text-emerald-600' : 'text-amber-600' },
          { label: 'Target Tanggal', value: '15 Sep 2026', color: 'text-purple-600' },
          { label: 'Status', value: completedChecks === checklist.length ? 'Siap' : 'Belum Siap', color: completedChecks === checklist.length ? 'text-emerald-600' : 'text-red-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method Selector */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Rocket size={16} className="text-blue-600" />
            Metode Peluncuran
          </h3>
          <div className="space-y-3">
            {[
              { id: 'airbag' as const, label: 'Airbag Launching', desc: 'Menggunakan airbag pneumatik untuk menggelincirkan kapal ke air. Cocok untuk kapal berukuran kecil-menengah.' },
              { id: 'slipway' as const, label: 'Slipway Launching', desc: 'Menggunakan rel miring (slipway) untuk peluncuran. Metode tradisional untuk galangan dengan fasilitas tetap.' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  method === m.id ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === m.id ? 'border-blue-600' : 'border-slate-400'}`}>
                    {method === m.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{m.label}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{m.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={runCalculation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-xs"
            >
              <Calculator size={16} />
              Hitung Parameter Peluncuran
            </button>
          </div>

          {calcResult && (
            <div className="mt-4 space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-4 slide-in">
              <h4 className="text-xs font-bold text-blue-700 mb-2">Hasil Perhitungan</h4>
              {Object.entries(calcResult).filter(([k]) => k !== 'status').map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-slate-900 font-bold">{val as string}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 mt-2">
                <span className={`badge ${calcResult.status === 'AMAN' ? 'badge-success' : 'badge-danger'} text-xs font-bold`}>
                  Status: {calcResult.status}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Safety Checklist */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield size={16} className="text-amber-500" />
            Safety Risk Checklist
          </h3>
          <div className="space-y-2">
            {checklist.map((item) => (
              <button key={item.id} onClick={() => toggleCheck(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  item.checked ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}>
                {item.checked ? <CheckSquare size={16} className="text-emerald-600 flex-shrink-0" /> : <Square size={16} className="text-slate-400 flex-shrink-0" />}
                <span className={`text-xs font-semibold ${item.checked ? 'text-slate-900' : 'text-slate-700'}`}>{item.item}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 progress-bar h-2.5">
            <div className="progress-bar-fill bg-emerald-500" style={{ width: `${(completedChecks / checklist.length) * 100}%` }} />
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">{completedChecks}/{checklist.length} item terpenuhi</p>
        </div>
      </div>
    </div>
  )
}
