import { useState } from 'react'
import { Package, Search, TrendingUp, DollarSign, Star, Truck } from 'lucide-react'

const purchaseOrders = [
  { id: 'PO-2026-001', vendor: 'PT Krakatau Steel', material: 'Steel Plate AH36', qty: '250 ton', value: '$1,250,000', status: 'received' as const, delivery: '2026-03-01' },
  { id: 'PO-2026-002', vendor: 'PT Baja Utama', material: 'Steel Pipe SCH40', qty: '500 unit', value: '$320,000', status: 'shipped' as const, delivery: '2026-04-15' },
  { id: 'PO-2026-003', vendor: 'Nippon Paint Marine', material: 'Epoxy Primer', qty: '2,000 ltr', value: '$85,000', status: 'ordered' as const, delivery: '2026-05-01' },
  { id: 'PO-2026-004', vendor: 'Lincoln Electric', material: 'Welding Electrode E7018', qty: '5,000 kg', value: '$45,000', status: 'inspected' as const, delivery: '2026-02-20' },
  { id: 'PO-2026-005', vendor: 'PT Fitting Marine', material: 'Butterfly Valve DN150', qty: '24 unit', value: '$96,000', status: 'ordered' as const, delivery: '2026-05-20' },
  { id: 'PO-2026-006', vendor: 'Caterpillar', material: 'Main Engine CAT C32', qty: '2 unit', value: '$2,400,000', status: 'shipped' as const, delivery: '2026-06-01' },
]

const vendors = [
  { name: 'PT Krakatau Steel', category: 'Steel Plate', rating: 4.5, deliveryRate: 95, orders: 12, totalValue: '$5.2M' },
  { name: 'Nippon Paint Marine', category: 'Coating', rating: 4.8, deliveryRate: 98, orders: 8, totalValue: '$680K' },
  { name: 'Lincoln Electric', category: 'Welding Consumable', rating: 4.3, deliveryRate: 92, orders: 15, totalValue: '$320K' },
  { name: 'Caterpillar', category: 'Main Engine', rating: 4.9, deliveryRate: 100, orders: 2, totalValue: '$4.8M' },
  { name: 'PT Baja Utama', category: 'Steel Pipe', rating: 4.0, deliveryRate: 88, orders: 10, totalValue: '$1.8M' },
]

export default function ProcurementMRP() {
  const [activeTab, setActiveTab] = useState<'po' | 'vendor'>('po')

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ordered: 'badge-info',
      shipped: 'badge-warning',
      received: 'badge-success',
      inspected: 'badge-success',
      rejected: 'badge-danger',
    }
    const labels: Record<string, string> = {
      ordered: 'Dipesan',
      shipped: 'Dikirim',
      received: 'Diterima',
      inspected: 'Diinspeksi',
      rejected: 'Ditolak',
    }
    return <span className={`badge ${styles[status]}`}>{labels[status]}</span>
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Procurement & MRP</h1>
        <p className="text-sm text-slate-500 font-medium">Manajemen Pengadaan & Material Requirements Planning</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total PO Aktif', value: '23', icon: Package, color: 'text-blue-600' },
          { label: 'Nilai Pengadaan', value: '$8.4M', icon: DollarSign, color: 'text-emerald-600' },
          { label: 'On-Time Delivery', value: '94%', icon: Truck, color: 'text-amber-600' },
          { label: 'Vendor Aktif', value: '18', icon: Star, color: 'text-purple-600' },
        ].map((k, i) => {
          const Icon = k.icon
          return (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500">{k.label}</span>
                <Icon size={16} className={k.color} />
              </div>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-200/70 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab('po')} className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${activeTab === 'po' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
          Purchase Orders
        </button>
        <button onClick={() => setActiveTab('vendor')} className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${activeTab === 'vendor' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
          Perbandingan Vendor
        </button>
      </div>

      {activeTab === 'po' ? (
        <div className="glass-card rounded-xl overflow-hidden shadow-xs">
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th>No. PO</th>
                <th>Vendor</th>
                <th>Material</th>
                <th>Jumlah</th>
                <th>Nilai</th>
                <th>Status</th>
                <th>Estimasi Tiba</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="cursor-pointer">
                  <td className="font-mono text-blue-700 font-bold text-xs">{po.id}</td>
                  <td className="text-slate-900 font-semibold">{po.vendor}</td>
                  <td className="text-slate-700 font-medium">{po.material}</td>
                  <td>{po.qty}</td>
                  <td className="text-emerald-700 font-bold">{po.value}</td>
                  <td>{getStatusBadge(po.status)}</td>
                  <td className="text-xs font-medium text-slate-500">{po.delivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden shadow-xs">
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Kategori</th>
                <th>Rating</th>
                <th>On-Time Delivery</th>
                <th>Total Order</th>
                <th>Total Nilai</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, i) => (
                <tr key={i}>
                  <td className="text-slate-900 font-semibold">{v.name}</td>
                  <td className="text-slate-700 font-medium">{v.category}</td>
                  <td>
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Star size={13} className="text-amber-500 fill-amber-500" />
                      <span>{v.rating}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${v.deliveryRate >= 95 ? 'bg-emerald-500' : v.deliveryRate >= 90 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${v.deliveryRate}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{v.deliveryRate}%</span>
                    </div>
                  </td>
                  <td className="font-medium text-slate-700">{v.orders}</td>
                  <td className="text-emerald-700 font-bold">{v.totalValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
