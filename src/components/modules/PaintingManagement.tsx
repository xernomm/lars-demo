import { useState } from 'react'
import { Paintbrush, CheckSquare, Square, CheckCircle } from 'lucide-react'

const dftRecords = [
  { id: 'DFT-001', area: 'Bottom Plate - Blok A1', system: 'Epoxy Primer + Antifouling', dft: 320, target: 300, batch: 'NP-2026-A001', applicator: 'Tim A', date: '2026-05-10', status: 'pass' as const },
  { id: 'DFT-002', area: 'Side Shell - Blok B2', system: 'Epoxy Primer + Topcoat', dft: 280, target: 300, batch: 'NP-2026-A002', applicator: 'Tim B', date: '2026-05-12', status: 'fail' as const },
  { id: 'DFT-003', area: 'Main Deck - Blok C1', system: 'Epoxy + Anti-slip', dft: 350, target: 320, batch: 'NP-2026-B001', applicator: 'Tim A', date: '2026-05-15', status: 'pass' as const },
  { id: 'DFT-004', area: 'Ballast Tank No.1', system: 'Epoxy Tar', dft: 310, target: 300, batch: 'NP-2026-B002', applicator: 'Tim C', date: '2026-05-18', status: 'pass' as const },
  { id: 'DFT-005', area: 'Engine Room Bulkhead', system: 'Alkyd Enamel', dft: 85, target: 100, batch: 'NP-2026-C001', applicator: 'Tim B', date: '2026-05-20', status: 'recoat' as const },
]

const surfacePrepChecklist = [
  { id: 1, item: 'Pembersihan permukaan dari minyak/grease', standard: 'SSPC-SP1', checked: true },
  { id: 2, item: 'Blasting mencapai Sa 2.5', standard: 'ISO 8501-1', checked: true },
  { id: 3, item: 'Profil permukaan 40-75 mikron', standard: 'ISO 8503', checked: true },
  { id: 4, item: 'Kelembaban relatif < 85%', standard: 'ISO 8502', checked: false },
  { id: 5, item: 'Suhu permukaan > 3°C di atas titik embun', standard: 'ISO 8502-4', checked: true },
  { id: 6, item: 'Tidak ada debu (Grade 1)', standard: 'ISO 8502-3', checked: false },
  { id: 7, item: 'Interval overcoat sesuai TDS', standard: 'Manufacturer TDS', checked: true },
]

export default function PaintingManagement() {
  const [checklist, setChecklist] = useState(surfacePrepChecklist)

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      pass: { cls: 'badge-success', label: 'Lulus' },
      fail: { cls: 'badge-danger', label: 'Gagal' },
      recoat: { cls: 'badge-warning', label: 'Recoat' },
    }
    const s = map[status]
    return <span className={`badge ${s.cls}`}>{s.label}</span>
  }

  const compliance = Math.round(dftRecords.filter(r => r.status === 'pass').length / dftRecords.length * 100)

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Painting Management</h1>
        <p className="text-sm text-slate-500 font-medium">Manajemen Pengecatan & DFT Measurement</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'DFT Compliance', value: `${compliance}%`, color: compliance >= 90 ? 'text-emerald-600' : 'text-amber-600' },
          { label: 'Area Selesai', value: '12/20', color: 'text-blue-600' },
          { label: 'Paint Batch Aktif', value: '8', color: 'text-purple-600' },
          { label: 'Perlu Recoat', value: dftRecords.filter(r => r.status === 'recoat').length.toString(), color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* DFT Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Paintbrush size={16} className="text-blue-600" />
            Log Pengukuran DFT (Dry Film Thickness)
          </h3>
        </div>
        <table className="w-full table-dark">
          <thead>
            <tr><th>ID</th><th>Area</th><th>Coating System</th><th>DFT (μm)</th><th>Target (μm)</th><th>Batch</th><th>Tanggal</th><th>Status</th></tr>
          </thead>
          <tbody>
            {dftRecords.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{r.id}</td>
                <td className="text-slate-900 font-semibold">{r.area}</td>
                <td className="text-xs text-slate-700">{r.system}</td>
                <td className={`font-bold ${r.dft >= r.target ? 'text-emerald-600' : 'text-red-600'}`}>{r.dft}</td>
                <td className="text-slate-700 font-medium">{r.target}</td>
                <td className="font-mono text-xs text-slate-700 font-medium">{r.batch}</td>
                <td className="text-xs text-slate-500 font-medium">{r.date}</td>
                <td>{getStatusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Surface Prep Checklist */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          Checklist Persiapan Permukaan
        </h3>
        <div className="space-y-2">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                item.checked ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.checked ? (
                <CheckSquare size={16} className="text-emerald-600 flex-shrink-0" />
              ) : (
                <Square size={16} className="text-slate-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <span className={`text-xs font-semibold ${item.checked ? 'text-slate-900' : 'text-slate-700'}`}>{item.item}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-medium">{item.standard}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 text-xs font-semibold text-slate-600">
          Progres: {checklist.filter(c => c.checked).length}/{checklist.length} item terpenuhi
        </div>
      </div>
    </div>
  )
}
