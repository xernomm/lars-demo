import { useState } from 'react'
import { Wrench, CheckCircle, AlertTriangle, ShieldCheck, UserCheck, Search, Award } from 'lucide-react'

const wpsList = [
  { id: 'WPS-001', code: 'WPS-AH36-FCAW-01', process: 'FCAW (Flux Cored Arc Welding)', material: 'AH36 Steel 12mm', position: '3G (Vertical Up)', status: 'qualified' as const, certNo: 'BKI-WPS-2026-01' },
  { id: 'WPS-002', code: 'WPS-A36-SMAW-02', process: 'SMAW (Shielded Metal Arc Welding)', material: 'A36 Steel 10mm', position: '2G (Horizontal)', status: 'qualified' as const, certNo: 'BKI-WPS-2026-02' },
  { id: 'WPS-003', code: 'WPS-AH36-SAW-03', process: 'SAW (Submerged Arc Welding)', material: 'AH36 Steel 20mm', position: '1G (Flat)', status: 'pending' as const, certNo: 'Pending Approval' },
  { id: 'WPS-004', code: 'WPS-SUS-GTAW-04', process: 'GTAW (Gas Tungsten Arc Welding)', material: 'SUS 316L Pipe 4"', status: 'qualified' as const, certNo: 'ABS-WPS-2026-09', position: '6G (All Position Pipe)' },
]

const welders = [
  { id: 'WS-001', name: 'Ahmad Subagyo', stamp: 'AS-01', certClass: 'BKI 3G/4G FCAW', expiry: '2026-11-20', status: 'valid' as const, defectRate: '1.2%' },
  { id: 'WS-002', name: 'Budi Santoso', stamp: 'BS-02', certClass: 'BKI 6G GTAW', expiry: '2026-06-15', status: 'expiring' as const, defectRate: '0.8%' },
  { id: 'WS-003', name: 'Candra Wijaya', stamp: 'CW-03', certClass: 'AWS 4G SMAW', expiry: '2026-12-10', status: 'valid' as const, defectRate: '2.1%' },
  { id: 'WS-004', name: 'Dedi Kurniawan', stamp: 'DK-04', certClass: 'BKI 1G SAW', expiry: '2026-04-01', status: 'expired' as const, defectRate: '3.5%' },
]

export default function WeldingManagement() {
  const [search, setSearch] = useState('')

  const filteredWelders = welders.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.stamp.toLowerCase().includes(search.toLowerCase()) ||
    w.certClass.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welding Management</h1>
        <p className="text-sm text-slate-500 font-medium">WPS Certification & Welder Performance Tracking — 300 FT Barge</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Qualified WPS', value: '18 Active', color: 'text-blue-600' },
          { label: 'Certified Welders', value: '34 Personnel', color: 'text-emerald-600' },
          { label: 'Avg Defect Rate', value: '1.4%', sub: 'Target < 2.0%', color: 'text-emerald-600' },
          { label: 'Expiring Certificates', value: '2 Welders', sub: 'Action required within 30 days', color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            {s.sub && <p className="text-[11px] font-medium text-slate-500 mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* WPS Repository */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600" /> Welding Procedure Specification (WPS) Repository
          </h2>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs">
            + Register New WPS
          </button>
        </div>
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>WPS Code</th>
              <th>Welding Process</th>
              <th>Base Material</th>
              <th>Position</th>
              <th>BKI Certificate No</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {wpsList.map((wps) => (
              <tr key={wps.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{wps.code}</td>
                <td className="font-semibold text-slate-800">{wps.process}</td>
                <td className="text-slate-700 font-medium">{wps.material}</td>
                <td className="text-xs text-slate-600">{wps.position}</td>
                <td className="font-mono text-slate-700 text-xs">{wps.certNo}</td>
                <td>
                  {wps.status === 'qualified' ? (
                    <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> Qualified</span>
                  ) : (
                    <span className="badge badge-warning"><AlertTriangle size={10} className="mr-1" /> Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Welder Tracking */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck size={16} className="text-blue-600" /> Certified Welder Performance & Expiry Tracker
          </h2>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search welder name or stamp..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredWelders.map((w) => (
            <div key={w.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                  Stamp #{w.stamp}
                </span>
                <span className={`badge ${w.status === 'valid' ? 'badge-success' : w.status === 'expiring' ? 'badge-warning' : 'badge-danger'} text-[10px] uppercase font-bold`}>
                  {w.status}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{w.name}</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{w.certClass}</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Defect Rate: <strong className="text-slate-900">{w.defectRate}</strong></span>
                <span className="text-slate-500 font-medium">Expires: <strong className="text-slate-800">{w.expiry}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
