import { useState } from 'react'

const wpsList = [
  { id: 'WPS-001', joint: 'Butt Joint', process: 'SMAW', position: '1G, 2G', material: 'AH36', thickness: '10-16mm', status: 'qualified' as const },
  { id: 'WPS-002', joint: 'Fillet Joint', process: 'FCAW', position: '1F, 2F, 3F', material: 'AH36', thickness: '8-20mm', status: 'qualified' as const },
  { id: 'WPS-003', joint: 'T-Joint', process: 'SAW', position: '1G', material: 'DH36', thickness: '16-25mm', status: 'qualified' as const },
  { id: 'WPS-004', joint: 'Butt Joint', process: 'GTAW+SMAW', position: '6G', material: 'SS304', thickness: '6-12mm', status: 'pending' as const },
  { id: 'WPS-005', joint: 'Lap Joint', process: 'SMAW', position: '1G, 2G', material: 'AH32', thickness: '8-14mm', status: 'expired' as const },
]

const welders = [
  { name: 'Ahmad Supriadi', stamp: 'WS-001', process: 'SMAW', position: '1G,2G,3G', validUntil: '2027-06-15', status: 'valid' as const, defectRate: 1.8 },
  { name: 'Budi Santoso', stamp: 'WS-002', process: 'FCAW', position: '1F,2F,3F,4F', validUntil: '2027-03-20', status: 'valid' as const, defectRate: 2.3 },
  { name: 'Cahyo Wibowo', stamp: 'WS-003', process: 'SMAW/FCAW', position: 'All Position', validUntil: '2026-09-01', status: 'expiring' as const, defectRate: 1.5 },
  { name: 'Dedi Kurniawan', stamp: 'WS-004', process: 'SAW', position: '1G', validUntil: '2026-12-31', status: 'valid' as const, defectRate: 3.1 },
  { name: 'Eko Prasetyo', stamp: 'WS-005', process: 'GTAW', position: '6G', validUntil: '2026-07-01', status: 'expired' as const, defectRate: 4.2 },
  { name: 'Fajar Rahman', stamp: 'WS-006', process: 'SMAW', position: '1G,2G', validUntil: '2027-08-10', status: 'valid' as const, defectRate: 2.0 },
]

export default function WeldingManagement() {
  const [activeTab, setActiveTab] = useState<'wps' | 'welder'>('wps')

  const overallDefectRate = (welders.reduce((sum, w) => sum + w.defectRate, 0) / welders.length).toFixed(1)

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welding Management</h1>
        <p className="text-sm text-slate-500 font-medium">Manajemen WPS & Sertifikasi Welder</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'WPS Aktif', value: wpsList.filter(w => w.status === 'qualified').length.toString(), color: 'text-emerald-600' },
          { label: 'Welder Aktif', value: welders.filter(w => w.status === 'valid').length.toString(), color: 'text-blue-600' },
          { label: 'Defect Rate', value: `${overallDefectRate}%`, color: Number(overallDefectRate) < 3 ? 'text-emerald-600' : 'text-amber-600' },
          { label: 'Sertifikat Expiring', value: welders.filter(w => w.status === 'expiring').length.toString(), color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Defect Rate Progress */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Tingkat Defect Keseluruhan</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="progress-bar h-3.5 bg-slate-100">
              <div className={`progress-bar-fill ${Number(overallDefectRate) < 3 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Number(overallDefectRate) * 10}%` }} />
            </div>
          </div>
          <span className="text-lg font-bold text-slate-900">{overallDefectRate}%</span>
          <span className="text-xs font-semibold text-slate-500">Target: &lt;3%</span>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-200/70 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab('wps')} className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${activeTab === 'wps' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
          WPS (Welding Procedure Spec)
        </button>
        <button onClick={() => setActiveTab('welder')} className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${activeTab === 'welder' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
          Sertifikasi Welder
        </button>
      </div>

      {activeTab === 'wps' ? (
        <div className="glass-card rounded-xl overflow-hidden shadow-xs">
          <table className="w-full table-dark">
            <thead>
              <tr><th>No. WPS</th><th>Jenis Sambungan</th><th>Proses</th><th>Posisi</th><th>Material</th><th>Tebal</th><th>Status</th></tr>
            </thead>
            <tbody>
              {wpsList.map((w) => (
                <tr key={w.id}>
                  <td className="font-mono text-blue-700 font-bold text-xs">{w.id}</td>
                  <td className="text-slate-900 font-semibold">{w.joint}</td>
                  <td className="font-medium text-slate-700">{w.process}</td>
                  <td className="text-slate-700">{w.position}</td>
                  <td className="text-slate-700 font-medium">{w.material}</td>
                  <td className="text-slate-700">{w.thickness}</td>
                  <td>
                    <span className={`badge ${w.status === 'qualified' ? 'badge-success' : w.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {w.status === 'qualified' ? 'Qualified' : w.status === 'pending' ? 'Pending' : 'Expired'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden shadow-xs">
          <table className="w-full table-dark">
            <thead>
              <tr><th>Nama Welder</th><th>Stamp</th><th>Proses</th><th>Posisi</th><th>Berlaku Sampai</th><th>Defect Rate</th><th>Status</th></tr>
            </thead>
            <tbody>
              {welders.map((w, i) => (
                <tr key={i}>
                  <td className="text-slate-900 font-semibold">{w.name}</td>
                  <td className="font-mono text-blue-700 font-bold text-xs">{w.stamp}</td>
                  <td className="font-medium text-slate-700">{w.process}</td>
                  <td className="text-xs text-slate-700">{w.position}</td>
                  <td className="text-xs text-slate-500 font-medium">{w.validUntil}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${w.defectRate < 2 ? 'bg-emerald-500' : w.defectRate < 3 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${w.defectRate * 20}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{w.defectRate}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${w.status === 'valid' ? 'badge-success' : w.status === 'expiring' ? 'badge-warning' : 'badge-danger'}`}>
                      {w.status === 'valid' ? 'Valid' : w.status === 'expiring' ? 'Akan Expired' : 'Expired'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
