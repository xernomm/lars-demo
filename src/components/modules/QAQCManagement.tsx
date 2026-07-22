import { useState } from 'react'
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, Bell } from 'lucide-react'

const inspectionItems = [
  { id: 'QA-001', category: 'Hull Structure', item: 'Kelurusan sambungan pelat bottom', standard: 'BKI Vol. II Sec. 5', status: 'approved' as const, inspector: 'Ir. Hadi', date: '2026-05-10', remarks: 'Sesuai standar' },
  { id: 'QA-002', category: 'Hull Structure', item: 'Gap dan root opening pengelasan', standard: 'BKI Vol. VI', status: 'approved' as const, inspector: 'Ir. Hadi', date: '2026-05-10', remarks: 'Toleransi terpenuhi' },
  { id: 'QA-003', category: 'Welding', item: 'Visual inspection lasan blok A2', standard: 'AWS D1.1', status: 'rejected' as const, inspector: 'Ir. Sari', date: '2026-05-12', remarks: 'Ditemukan undercut > 1mm' },
  { id: 'QA-004', category: 'Welding', item: 'NDT result - RT Joint B3-07', standard: 'BKI Vol. VI Sec. 3', status: 'pending' as const, inspector: null, date: null, remarks: null },
  { id: 'QA-005', category: 'Painting', item: 'DFT check ballast tank no.1', standard: 'IMO PSPC', status: 'approved' as const, inspector: 'Ir. Dewi', date: '2026-05-14', remarks: 'DFT 320μm OK' },
  { id: 'QA-006', category: 'Outfitting', item: 'Main engine alignment verification', standard: 'Maker Standard', status: 'pending' as const, inspector: null, date: null, remarks: null },
  { id: 'QA-007', category: 'Hull Structure', item: 'Dimensi dan fairness shell plate', standard: 'BKI Vol. II', status: 'approved' as const, inspector: 'Ir. Hadi', date: '2026-05-08', remarks: 'Dalam toleransi' },
]

const holdPoints = [
  { id: 'HP-001', name: 'Keel Laying Inspection', status: 'released' as const, date: '2026-01-15', surveyor: 'BKI Surveyor' },
  { id: 'HP-002', name: 'Block Assembly Completion', status: 'released' as const, date: '2026-03-20', surveyor: 'BKI Surveyor' },
  { id: 'HP-003', name: 'Hull Erection QA Check', status: 'active' as const, date: '2026-05-15', surveyor: 'Internal QC' },
  { id: 'HP-004', name: 'Tank Test - Ballast Tanks', status: 'pending' as const, date: null, surveyor: 'BKI Surveyor' },
  { id: 'HP-005', name: 'Painting System Approval', status: 'pending' as const, date: null, surveyor: 'Owner Surveyor' },
  { id: 'HP-006', name: 'Sea Trial Witness', status: 'pending' as const, date: null, surveyor: 'BKI + Owner' },
]

const qualityAlerts = [
  { id: 1, type: 'error' as const, message: 'NCR-2026-003: Undercut pada lasan Blok A2 melebihi batas', time: '2 jam lalu' },
  { id: 2, type: 'warning' as const, message: 'Hold Point HP-003 memerlukan tanda tangan surveyor', time: '5 jam lalu' },
  { id: 3, type: 'info' as const, message: 'Inspeksi DFT ballast tank no.1 berhasil — semua lulus', time: '1 hari lalu' },
  { id: 4, type: 'warning' as const, message: 'Sertifikat welder WS-003 akan expired dalam 60 hari', time: '2 hari lalu' },
]

export default function QAQCManagement() {
  const [items, setItems] = useState(inspectionItems)

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: action, inspector: 'Ir. Admin', date: new Date().toISOString().split('T')[0], remarks: action === 'approved' ? 'Disetujui' : 'Ditolak — perlu perbaikan' } : item
    ))
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">QA/QC Management</h1>
        <p className="text-sm text-slate-500 font-medium">Manajemen Kualitas & Inspeksi</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Inspeksi', value: items.length.toString(), color: 'text-blue-600' },
          { label: 'Disetujui', value: items.filter(i => i.status === 'approved').length.toString(), color: 'text-emerald-600' },
          { label: 'Ditolak', value: items.filter(i => i.status === 'rejected').length.toString(), color: 'text-red-600' },
          { label: 'Menunggu', value: items.filter(i => i.status === 'pending').length.toString(), color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Inspection Checklist */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Shield size={16} className="text-blue-600" />
            Checklist Inspeksi Digital
          </h3>
        </div>
        <table className="w-full table-dark">
          <thead>
            <tr><th>ID</th><th>Kategori</th><th>Item Inspeksi</th><th>Standar</th><th>Status</th><th>Inspektor</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{item.id}</td>
                <td className="text-xs text-slate-700 font-medium">{item.category}</td>
                <td className="text-slate-900 font-semibold text-xs">{item.item}</td>
                <td className="font-mono text-[10px] text-slate-500 font-medium">{item.standard}</td>
                <td>
                  <span className={`badge ${item.status === 'approved' ? 'badge-success' : item.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                  </span>
                </td>
                <td className="text-xs font-medium text-slate-600">{item.inspector || '—'}</td>
                <td>
                  {item.status === 'pending' && (
                    <div className="flex gap-1">
                      <button onClick={() => handleAction(item.id, 'approved')} className="px-2.5 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-bold hover:bg-emerald-700 transition-colors shadow-xs">
                        Setujui
                      </button>
                      <button onClick={() => handleAction(item.id, 'rejected')} className="px-2.5 py-1 bg-red-600 text-white rounded-md text-[10px] font-bold hover:bg-red-700 transition-colors shadow-xs">
                        Tolak
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hold Points */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" /> Hold Point Tracker
          </h3>
          <div className="space-y-2">
            {holdPoints.map((hp) => (
              <div key={hp.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                hp.status === 'released' ? 'bg-emerald-50/60 border-emerald-200' :
                hp.status === 'active' ? 'bg-blue-50/60 border-blue-200' :
                'bg-slate-50 border-slate-200'
              }`}>
                {hp.status === 'released' ? <CheckCircle size={15} className="text-emerald-600" /> :
                 hp.status === 'active' ? <Clock size={15} className="text-blue-600 animate-pulse" /> :
                 <Clock size={15} className="text-slate-400" />}
                <div className="flex-1">
                  <p className="text-xs text-slate-900 font-bold">{hp.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{hp.surveyor} {hp.date ? `• ${hp.date}` : ''}</p>
                </div>
                <span className={`badge text-[10px] ${hp.status === 'released' ? 'badge-success' : hp.status === 'active' ? 'badge-info' : 'badge-neutral'}`}>
                  {hp.status === 'released' ? 'Released' : hp.status === 'active' ? 'Active' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Alerts */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Bell size={16} className="text-red-500" /> Quality Alerts
          </h3>
          <div className="space-y-2">
            {qualityAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'error' ? 'border-l-red-500 bg-red-50/50 border border-slate-200' :
                alert.type === 'warning' ? 'border-l-amber-500 bg-amber-50/50 border border-slate-200' :
                'border-l-blue-500 bg-blue-50/50 border border-slate-200'
              }`}>
                <p className="text-xs font-semibold text-slate-800">{alert.message}</p>
                <p className="text-[10px] font-medium text-slate-500 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
