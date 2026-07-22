import { Navigation, Anchor } from 'lucide-react'

type TrialStatus = 'pass' | 'fail' | 'pending'

const stabilityTests: { id: string; test: string; parameter: string; target: string; actual: string; unit: string; status: TrialStatus; date: string | null }[] = [
  { id: 'ST-001', test: 'Inclining Experiment', parameter: 'GM', target: '> 0.15 m', actual: '1.24 m', unit: 'm', status: 'pass' as const, date: '2026-09-20' },
  { id: 'ST-002', test: 'Lightship Survey', parameter: 'Displacement', target: '3,200 ± 50 ton', actual: '3,218 ton', unit: 'ton', status: 'pass' as const, date: '2026-09-20' },
  { id: 'ST-003', test: 'Draft Reading - Fore', parameter: 'Draft Fore', target: '2.5 - 3.0 m', actual: '2.72 m', unit: 'm', status: 'pass' as const, date: '2026-09-22' },
  { id: 'ST-004', test: 'Draft Reading - Aft', parameter: 'Draft Aft', target: '3.5 - 4.0 m', actual: '3.81 m', unit: 'm', status: 'pass' as const, date: '2026-09-22' },
  { id: 'ST-005', test: 'Speed Trial', parameter: 'Service Speed', target: '> 10 knots', actual: '11.2 knots', unit: 'knots', status: 'pass' as const, date: '2026-10-01' },
  { id: 'ST-006', test: 'Towing Trial', parameter: 'Bollard Pull', target: '> 45 ton', actual: '48.5 ton', unit: 'ton', status: 'pass' as const, date: '2026-10-02' },
  { id: 'ST-007', test: 'Steering Test', parameter: 'Rudder Angle', target: '35° each side', actual: '35°', unit: '°', status: 'pass' as const, date: '2026-10-03' },
  { id: 'ST-008', test: 'Emergency Stop Test', parameter: 'Stopping Distance', target: '< 15 L', actual: 'Pending', unit: 'L', status: 'pending' as const, date: null },
  { id: 'ST-009', test: 'Anchor Drop Test', parameter: 'Drop Time', target: '< 3 min', actual: 'Pending', unit: 'min', status: 'pending' as const, date: null },
]

const performanceData = [
  { label: 'Speed', planned: 10, actual: 11.2, unit: 'kn', max: 14 },
  { label: 'Fuel Rate', planned: 180, actual: 172, unit: 'L/h', max: 250 },
  { label: 'Bollard Pull', planned: 45, actual: 48.5, unit: 'ton', max: 60 },
  { label: 'GM', planned: 1.0, actual: 1.24, unit: 'm', max: 2 },
  { label: 'Vibration', planned: 4.0, actual: 3.2, unit: 'mm/s', max: 6 },
]

export default function SeaTrialManagement() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Navigation size={28} className="text-blue-600" />
          Sea Trial Management
        </h1>
        <p className="text-sm text-slate-500 font-medium">Uji Coba Laut — Stabilitas & Performa</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Uji', value: stabilityTests.length.toString(), color: 'text-blue-600' },
          { label: 'Lulus', value: stabilityTests.filter(t => t.status === 'pass').length.toString(), color: 'text-emerald-600' },
          { label: 'Gagal', value: stabilityTests.filter(t => t.status === 'fail').length.toString(), color: 'text-red-600' },
          { label: 'Pending', value: stabilityTests.filter(t => t.status === 'pending').length.toString(), color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Anchor size={16} className="text-blue-600" />
          Data Performa Uji Coba
        </h3>
        <div className="space-y-4">
          {performanceData.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                <div className="flex items-center gap-3 text-xs font-medium">
                  <span className="text-slate-500">Target: {item.planned} {item.unit}</span>
                  <span className="text-slate-900 font-bold">Aktual: {item.actual} {item.unit}</span>
                </div>
              </div>
              <div className="flex gap-1 h-5">
                <div className="flex-1 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-slate-400 z-10" style={{ left: `${(item.planned / item.max) * 100}%` }} />
                  <div className={`h-full rounded-full ${item.actual >= item.planned ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(item.actual / item.max) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-2 rounded-sm bg-emerald-500" />
            <span className="text-[10px] font-semibold text-slate-600">Aktual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-0 h-3 border-r-2 border-dashed border-slate-400" />
            <span className="text-[10px] font-semibold text-slate-600">Target</span>
          </div>
        </div>
      </div>

      {/* Test Log Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">Log Uji Coba Laut</h3>
        </div>
        <table className="w-full table-dark">
          <thead>
            <tr><th>ID</th><th>Nama Uji</th><th>Parameter</th><th>Target</th><th>Aktual</th><th>Satuan</th><th>Status</th><th>Tanggal</th></tr>
          </thead>
          <tbody>
            {stabilityTests.map((t) => (
              <tr key={t.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{t.id}</td>
                <td className="text-slate-900 font-semibold text-xs">{t.test}</td>
                <td className="text-xs text-slate-700 font-medium">{t.parameter}</td>
                <td className="text-xs text-slate-700">{t.target}</td>
                <td className={`text-xs font-bold ${t.status === 'pass' ? 'text-emerald-600' : t.status === 'pending' ? 'text-slate-400' : 'text-red-600'}`}>{t.actual}</td>
                <td className="text-xs text-slate-600">{t.unit}</td>
                <td>
                  <span className={`badge ${t.status === 'pass' ? 'badge-success' : t.status === 'fail' ? 'badge-danger' : 'badge-warning'}`}>
                    {t.status === 'pass' ? 'Lulus' : t.status === 'fail' ? 'Gagal' : 'Pending'}
                  </span>
                </td>
                <td className="text-xs text-slate-500 font-medium">{t.date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
