import { useState } from 'react'
import { QrCode, Search, X, CheckCircle, MapPin } from 'lucide-react'

const materials = [
  { id: 'M001', name: 'Steel Plate AH36', heat: 'HT-2026-A1042', grade: 'AH36', thickness: '12mm', qty: 45, unit: 'lembar', location: 'Gudang A - Rak 1', cert: 'BKI-MC-2026-001', status: 'available' as const },
  { id: 'M002', name: 'Steel Plate AH36', heat: 'HT-2026-A1043', grade: 'AH36', thickness: '16mm', qty: 30, unit: 'lembar', location: 'Gudang A - Rak 2', cert: 'BKI-MC-2026-002', status: 'allocated' as const },
  { id: 'M003', name: 'Steel Pipe SCH40', heat: 'HT-2026-P0521', grade: 'A106 Gr.B', thickness: '6"', qty: 120, unit: 'batang', location: 'Gudang B - Rak 5', cert: 'BKI-MC-2026-008', status: 'available' as const },
  { id: 'M004', name: 'Welding Rod E7018', heat: 'WR-2026-E001', grade: 'E7018', thickness: '3.2mm', qty: 500, unit: 'kg', location: 'Gudang C - Rak 1', cert: 'AWS-WC-001', status: 'used' as const },
  { id: 'M005', name: 'Flat Bar 100x10', heat: 'HT-2026-F0102', grade: 'SS400', thickness: '10mm', qty: 80, unit: 'batang', location: 'Gudang A - Rak 4', cert: 'BKI-MC-2026-012', status: 'available' as const },
  { id: 'M006', name: 'Steel Plate DH36', heat: 'HT-2026-D0801', grade: 'DH36', thickness: '20mm', qty: 15, unit: 'lembar', location: 'Gudang A - Rak 3', cert: 'BKI-MC-2026-015', status: 'rejected' as const },
  { id: 'M007', name: 'Angle Bar 150x90x12', heat: 'HT-2026-AB001', grade: 'AH32', thickness: '12mm', qty: 60, unit: 'batang', location: 'Gudang B - Rak 2', cert: 'BKI-MC-2026-018', status: 'allocated' as const },
]

export default function MaterialTracking() {
  const [search, setSearch] = useState('')
  const [showQRModal, setShowQRModal] = useState(false)
  const [scannedMaterial, setScannedMaterial] = useState<typeof materials[0] | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.heat.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  )

  const handleScanQR = () => {
    setIsScanning(true)
    setScannedMaterial(null)
    setTimeout(() => {
      setIsScanning(false)
      setScannedMaterial(materials[Math.floor(Math.random() * materials.length)])
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      available: { cls: 'badge-success', label: 'Tersedia' },
      allocated: { cls: 'badge-info', label: 'Dialokasikan' },
      used: { cls: 'badge-warning', label: 'Terpakai' },
      rejected: { cls: 'badge-danger', label: 'Ditolak' },
    }
    const s = map[status] || map.available
    return <span className={`badge ${s.cls}`}>{s.label}</span>
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Material Tracking</h1>
          <p className="text-sm text-slate-500 font-medium">Pelacakan Material & QR Code Scanner</p>
        </div>
        <button onClick={() => setShowQRModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors">
          <QrCode size={16} />
          Scan QR Code
        </button>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Item', value: materials.length.toString(), color: 'text-blue-600' },
          { label: 'Tersedia', value: materials.filter(m => m.status === 'available').length.toString(), color: 'text-emerald-600' },
          { label: 'Dialokasikan', value: materials.filter(m => m.status === 'allocated').length.toString(), color: 'text-amber-600' },
          { label: 'Ditolak', value: materials.filter(m => m.status === 'rejected').length.toString(), color: 'text-red-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari material, heat number, atau ID..."
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
        />
      </div>

      {/* Material Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Material</th>
              <th>Heat Number</th>
              <th>Grade</th>
              <th>Tebal/Ukuran</th>
              <th>Jumlah</th>
              <th>Lokasi</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{m.id}</td>
                <td className="text-slate-900 font-semibold">{m.name}</td>
                <td className="font-mono text-xs text-amber-700 font-bold">{m.heat}</td>
                <td className="font-medium text-slate-700">{m.grade}</td>
                <td className="text-slate-700">{m.thickness}</td>
                <td className="font-semibold text-slate-800">{m.qty} {m.unit}</td>
                <td className="text-xs">
                  <span className="flex items-center gap-1 font-medium text-slate-600"><MapPin size={11} className="text-slate-400" />{m.location}</span>
                </td>
                <td>{getStatusBadge(m.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Scanner Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setShowQRModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-2xl animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <QrCode size={20} className="text-blue-600" />
                Simulasi Scan QR Code
              </h3>
              <button onClick={() => setShowQRModal(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {!scannedMaterial && !isScanning && (
              <div className="text-center py-8">
                <div className="w-32 h-32 mx-auto border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center mb-4 bg-blue-50/50">
                  <QrCode size={48} className="text-blue-500/70" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-4">Arahkan kamera ke QR Code material</p>
                <button onClick={handleScanQR} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs">
                  Mulai Scan
                </button>
              </div>
            )}

            {isScanning && (
              <div className="text-center py-8">
                <div className="w-32 h-32 mx-auto border-2 border-blue-500 rounded-xl flex items-center justify-center mb-4 bg-blue-50 animate-pulse">
                  <QrCode size={48} className="text-blue-600 animate-spin-slow" />
                </div>
                <p className="text-sm font-bold text-blue-600">Memindai QR Code...</p>
              </div>
            )}

            {scannedMaterial && (
              <div className="space-y-3 slide-in">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-3">
                  <CheckCircle size={16} />
                  <span className="text-sm">QR Code Berhasil Dipindai!</span>
                </div>
                <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-lg p-4">
                  {[
                    ['ID Material', scannedMaterial.id],
                    ['Nama', scannedMaterial.name],
                    ['Heat Number', scannedMaterial.heat],
                    ['Grade', scannedMaterial.grade],
                    ['Tebal/Ukuran', scannedMaterial.thickness],
                    ['Jumlah', `${scannedMaterial.qty} ${scannedMaterial.unit}`],
                    ['Lokasi', scannedMaterial.location],
                    ['Sertifikat', scannedMaterial.cert],
                  ].map(([label, value], idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">{label}</span>
                      <span className="text-slate-900 font-bold">{value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={handleScanQR} className="w-full mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors">
                  Scan Lagi
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
