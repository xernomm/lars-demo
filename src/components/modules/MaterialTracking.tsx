import { useState } from 'react'
import { QrCode, Search, CheckCircle, Package, AlertTriangle, Cpu, Tag, FileCheck } from 'lucide-react'

const materials = [
  { id: 'MAT-001', qrCode: 'QR-AH36-12-001', item: 'Marine Steel Plate AH36 12mm', spec: 'AH36 / BKI Class A', heatNo: 'HT-98421-A', certNo: 'BKI-CRT-2026-881', location: 'Yard Block B2', qty: '45 Pcs', status: 'available' as const },
  { id: 'MAT-002', qrCode: 'QR-AH36-10-002', item: 'Marine Steel Plate AH36 10mm', spec: 'AH36 / BKI Class A', heatNo: 'HT-98421-B', certNo: 'BKI-CRT-2026-882', location: 'Cutting Shop 1', qty: '30 Pcs', status: 'allocated' as const },
  { id: 'MAT-003', qrCode: 'QR-PIP-04-001', item: 'Seamless Pipe Schedule 80 4"', spec: 'ASTM A106 Grade B', heatNo: 'HT-45120-P', certNo: 'BKI-CRT-2026-905', location: 'Pipe Storage Yard', qty: '120 Mtr', status: 'available' as const },
  { id: 'MAT-004', qrCode: 'QR-FLG-04-012', item: 'Slip-On Flange 4" 150#', spec: 'ASTM A105', heatNo: 'HT-11209-F', certNo: 'BKI-CRT-2026-912', location: 'Warehouse Rack 4', qty: '80 Pcs', status: 'used' as const },
  { id: 'MAT-005', qrCode: 'QR-PNT-JT-001', item: 'Jotamastic 90 Marine Primer', spec: 'Epoxy Coating', heatNo: 'LOT-JOT-2026-04', certNo: 'ISO-9001-JOT', location: 'Chemical Store', qty: '600 Ltr', status: 'available' as const },
  { id: 'MAT-006', qrCode: 'QR-WLD-7018-01', item: 'E7018 Welding Electrodes 3.2mm', spec: 'AWS A5.1 E7018', heatNo: 'HT-7018-88A', certNo: 'AWS-CERT-2026', location: 'Welding Store', qty: '250 Kg', status: 'available' as const },
]

export default function MaterialTracking() {
  const [search, setSearch] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState<typeof materials[0] | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const filtered = materials.filter((m) =>
    m.item.toLowerCase().includes(search.toLowerCase()) ||
    m.qrCode.toLowerCase().includes(search.toLowerCase()) ||
    m.heatNo.toLowerCase().includes(search.toLowerCase())
  )

  const handleSimulateScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      const random = materials[Math.floor(Math.random() * materials.length)]
      setSelectedMaterial(random)
      setIsScanning(false)
    }, 1200)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> Available</span>
      case 'allocated': return <span className="badge badge-info"><Package size={10} className="mr-1" /> Allocated</span>
      case 'used': return <span className="badge badge-neutral">Used</span>
      default: return <span className="badge badge-warning"><AlertTriangle size={10} className="mr-1" /> Quarantine</span>
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Material Tracking</h1>
          <p className="text-sm text-slate-500 font-medium">QR Code Traceability & Mill Certificate Verification</p>
        </div>
        <button
          onClick={handleSimulateScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
        >
          <QrCode size={16} className={isScanning ? 'animate-spin' : ''} />
          {isScanning ? 'Scanning QR Code...' : 'Simulate QR Code Scan'}
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracked Materials', value: '1,420 Items', color: 'text-blue-600' },
          { label: 'Verified Heat Numbers', value: '100%', color: 'text-emerald-600' },
          { label: 'BKI Certificates Linked', value: '1,380 Certs', color: 'text-sky-600' },
          { label: 'Stock Locations', value: '8 Yards', color: 'text-indigo-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Scanner Detail Modal / Panel */}
      {selectedMaterial && (
        <div className="glass-card rounded-xl p-5 border-2 border-blue-200 bg-blue-50/40 slide-in">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <QrCode size={20} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">QR Code Scan Result — {selectedMaterial.qrCode}</h3>
            </div>
            <button onClick={() => setSelectedMaterial(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Material Name</span>
              <span className="font-bold text-slate-900">{selectedMaterial.item}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Specification</span>
              <span className="font-semibold text-blue-700">{selectedMaterial.spec}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Heat Number</span>
              <span className="font-mono font-bold text-emerald-700">{selectedMaterial.heatNo}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Mill Certificate</span>
              <span className="font-mono text-slate-800 flex items-center gap-1 font-semibold">
                <FileCheck size={12} className="text-emerald-600" /> {selectedMaterial.certNo}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search material, QR Code, or heat number..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Materials Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>QR Code ID</th>
              <th>Material Description</th>
              <th>Specification</th>
              <th>Heat Number</th>
              <th>Mill Certificate</th>
              <th>Yard Location</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedMaterial(m)}>
                <td className="font-mono text-blue-700 font-bold text-xs flex items-center gap-1.5">
                  <Tag size={12} className="text-blue-500" /> {m.qrCode}
                </td>
                <td className="font-semibold text-slate-800">{m.item}</td>
                <td className="text-xs text-slate-600 font-medium">{m.spec}</td>
                <td className="font-mono text-emerald-700 font-bold">{m.heatNo}</td>
                <td className="font-mono text-slate-700 text-xs">{m.certNo}</td>
                <td>{m.location}</td>
                <td className="font-bold text-slate-800">{m.qty}</td>
                <td>{getStatusBadge(m.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
