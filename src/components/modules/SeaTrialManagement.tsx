import { useState } from 'react'
import { Navigation, CheckCircle, AlertTriangle, Clock, Activity, Gauge, Compass } from 'lucide-react'

interface StabilityTest {
  id: string
  testName: string
  spec: string
  actual: string
  status: 'pass' | 'fail' | 'pending'
  inspector: string
}

const stabilityTests: StabilityTest[] = [
  { id: 'ST-001', testName: 'Inclining Experiment (Lightship GM)', spec: 'GM >= 1.50 m', actual: 'GM = 1.82 m', status: 'pass', inspector: 'BKI Surveyor' },
  { id: 'ST-002', testName: 'Draft Mark Verification (Fore / Aft)', spec: 'Draft 2.50 m', actual: 'Fore 2.48m / Aft 2.52m', status: 'pass', inspector: 'QC Inspector' },
  { id: 'ST-003', testName: 'Barge Towing Speed Test (100% MCR)', spec: 'Speed >= 10.0 Knots', actual: '10.8 Knots', status: 'pass', inspector: 'Test Captain' },
  { id: 'ST-004', testName: 'Emergency Steering & Maneuvering', spec: '35° to 30° < 28 sec', actual: '22.4 sec', status: 'pass', inspector: 'BKI Surveyor' },
  { id: 'ST-005', testName: 'Anchor Dropping & Holding Test', spec: 'Hold 50T Load', actual: 'Pending Sea Trial', status: 'pending', inspector: 'BKI Surveyor' },
]

export default function SeaTrialManagement() {
  const [filter, setFilter] = useState<string>('all')

  const filtered = stabilityTests.filter((t) => filter === 'all' || t.status === filter)

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sea Trial Management</h1>
        <p className="text-sm text-slate-500 font-medium">Inclining Experiment, Speed Trial & BKI Protocol Verification — 300 FT Barge</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Calculated GM Height', value: '1.82 Meters', sub: 'Target GM >= 1.50m', color: 'text-blue-600' },
          { label: 'Measured Max Speed', value: '10.8 Knots', sub: '100% MCR Engine Power', color: 'text-emerald-600' },
          { label: 'Sea Trial Pass Rate', value: '80% (4/5)', sub: '1 Test Pending', color: 'text-sky-600' },
          { label: 'BKI Surveyor Approval', value: 'Endorsed', sub: 'Protocol #ST-2026-09', color: 'text-indigo-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-xl p-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Navigation size={16} className="text-blue-600" /> Sea Trial Protocol Test Log
        </h2>
        <div className="flex gap-1">
          {['all', 'pass', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'All Tests' : f === 'pass' ? 'Passed' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* Sea Trial Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Sea Trial Protocol Test Name</th>
              <th>Rule Specification</th>
              <th>Actual Measured Performance</th>
              <th>Certified Inspector</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{t.id}</td>
                <td className="font-bold text-slate-900">{t.testName}</td>
                <td className="text-xs text-slate-600 font-medium">{t.spec}</td>
                <td className="font-mono text-xs font-bold text-slate-900">{t.actual}</td>
                <td className="text-xs text-slate-700 font-semibold">{t.inspector}</td>
                <td>
                  {t.status === 'pass' ? (
                    <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> PASS</span>
                  ) : (
                    <span className="badge badge-warning"><Clock size={10} className="mr-1" /> PENDING</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
