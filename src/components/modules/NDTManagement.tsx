import { Microscope, MapPin, AlertCircle } from 'lucide-react'

const ndtRecords = [
  { id: 'NDT-001', method: 'RT' as const, joint: 'BJ-A3-07', location: 'Frame 45 PS - Butt Joint', result: 'acceptable' as const, defect: '-', film: 'RT-001-A', operator: 'Ahmad S.', date: '2026-05-08' },
  { id: 'NDT-002', method: 'RT' as const, joint: 'BJ-A3-08', location: 'Frame 46 PS - Butt Joint', result: 'repairable' as const, defect: 'Porosity cluster', film: 'RT-002-A', operator: 'Ahmad S.', date: '2026-05-08' },
  { id: 'NDT-003', method: 'UT' as const, joint: 'BJ-B1-03', location: 'Bottom Plate - Butt Joint', result: 'acceptable' as const, defect: '-', film: '-', operator: 'Budi R.', date: '2026-05-10' },
  { id: 'NDT-004', method: 'UT' as const, joint: 'FW-C2-11', location: 'Web Frame 52 - Fillet', result: 'rejected' as const, defect: 'Lack of fusion', film: '-', operator: 'Budi R.', date: '2026-05-11' },
  { id: 'NDT-005', method: 'MT' as const, joint: 'BJ-A4-01', location: 'Frame 48 SB - Butt Joint', result: 'acceptable' as const, defect: '-', film: '-', operator: 'Cahyo W.', date: '2026-05-12' },
  { id: 'NDT-006', method: 'PT' as const, joint: 'PW-E1-05', location: 'Pipe Weld - Engine Room', result: 'acceptable' as const, defect: '-', film: '-', operator: 'Cahyo W.', date: '2026-05-13' },
  { id: 'NDT-007', method: 'RT' as const, joint: 'BJ-B2-09', location: 'Side Shell - Butt Joint', result: 'repairable' as const, defect: 'Slag inclusion', film: 'RT-003-B', operator: 'Ahmad S.', date: '2026-05-14' },
]

const defectMarkers = [
  { x: 25, y: 70, label: 'Porosity - Fr.46 PS', severity: 'minor' },
  { x: 60, y: 85, label: 'Lack of Fusion - Fr.52', severity: 'major' },
  { x: 40, y: 40, label: 'Slag Inclusion - Side Shell', severity: 'minor' },
]

export default function NDTManagement() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">NDT Management</h1>
        <p className="text-sm text-slate-500 font-medium">Non-Destructive Testing — RT, UT, MT, PT</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total NDT', value: ndtRecords.length.toString(), color: 'text-blue-600' },
          { label: 'Acceptable', value: ndtRecords.filter(r => r.result === 'acceptable').length.toString(), color: 'text-emerald-600' },
          { label: 'Repairable', value: ndtRecords.filter(r => r.result === 'repairable').length.toString(), color: 'text-amber-600' },
          { label: 'Rejected', value: ndtRecords.filter(r => r.result === 'rejected').length.toString(), color: 'text-red-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Ship Cross-Section Diagram */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin size={16} className="text-blue-600" />
          Peta Lokasi Defect — Penampang Kapal
        </h3>
        <div className="relative bg-slate-50 border border-slate-200 rounded-lg p-4" style={{ height: '220px' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <path d="M 10 50 Q 10 85 30 90 L 70 90 Q 90 85 90 50 L 85 30 L 75 20 L 25 20 L 15 30 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="15" y1="30" x2="85" y2="30" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="30" y1="90" x2="70" y2="90" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="90" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
            {[30, 40, 50, 60, 70].map(x => (
              <line key={x} x1={x} y1="20" x2={x} y2="90" stroke="#e2e8f0" strokeWidth="0.8" />
            ))}
            <text x="50" y="16" textAnchor="middle" className="text-[4px] font-bold fill-slate-600">DECK</text>
            <text x="50" y="97" textAnchor="middle" className="text-[4px] font-bold fill-slate-600">BOTTOM</text>
            <text x="5" y="55" textAnchor="middle" className="text-[3px] font-bold fill-slate-500">PS</text>
            <text x="95" y="55" textAnchor="middle" className="text-[3px] font-bold fill-slate-500">SB</text>

            {defectMarkers.map((marker, idx) => (
              <g key={idx}>
                <circle cx={marker.x} cy={marker.y} r="3.5" className={`${marker.severity === 'major' ? 'fill-red-500' : 'fill-amber-500'} animate-pulse`} opacity={0.6} />
                <circle cx={marker.x} cy={marker.y} r="1.8" className={`${marker.severity === 'major' ? 'fill-red-600' : 'fill-amber-600'}`} />
              </g>
            ))}
          </svg>

          <div className="absolute bottom-2 right-2 flex items-center gap-3 bg-white/90 px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-slate-700">Major</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-slate-700">Minor</span>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {defectMarkers.map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <AlertCircle size={14} className={m.severity === 'major' ? 'text-red-500' : 'text-amber-500'} />
              <span className="text-slate-800 font-semibold">{m.label}</span>
              <span className={`badge text-[9px] ${m.severity === 'major' ? 'badge-danger' : 'badge-warning'}`}>{m.severity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NDT Records Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Microscope size={16} className="text-blue-600" />
            Log Hasil NDT
          </h3>
        </div>
        <table className="w-full table-dark">
          <thead>
            <tr><th>ID</th><th>Metode</th><th>Joint ID</th><th>Lokasi</th><th>Hasil</th><th>Jenis Defect</th><th>No. Film</th><th>Operator</th><th>Tanggal</th></tr>
          </thead>
          <tbody>
            {ndtRecords.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{r.id}</td>
                <td><span className="badge badge-info text-[10px]">{r.method}</span></td>
                <td className="font-mono text-xs font-semibold text-slate-800">{r.joint}</td>
                <td className="text-xs text-slate-700 font-medium">{r.location}</td>
                <td>
                  <span className={`badge ${r.result === 'acceptable' ? 'badge-success' : r.result === 'repairable' ? 'badge-warning' : 'badge-danger'}`}>
                    {r.result === 'acceptable' ? 'Diterima' : r.result === 'repairable' ? 'Perbaiki' : 'Ditolak'}
                  </span>
                </td>
                <td className="text-xs font-medium text-slate-700">{r.defect}</td>
                <td className="font-mono text-xs text-slate-600">{r.film}</td>
                <td className="text-xs text-slate-700">{r.operator}</td>
                <td className="text-xs text-slate-500 font-medium">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
