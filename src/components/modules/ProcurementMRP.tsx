import { useState } from 'react'
import { Search, ShoppingCart, Truck, CheckCircle, Clock, Sparkles, Building2, Star } from 'lucide-react'

const purchaseOrders = [
  { id: 'PO-2026-001', vendor: 'PT Krakatau Steel', item: 'AH36 Marine Steel Plate 12mm', qty: '120 Tons', total: '$180,000', status: 'shipped' as const, delivery: '2026-05-15', rating: 4.8 },
  { id: 'PO-2026-002', vendor: 'PT Gunawan Dianjaya', item: 'A36 Hull Steel Plate 10mm', qty: '85 Tons', total: '$119,000', status: 'received' as const, delivery: '2026-04-20', rating: 4.5 },
  { id: 'PO-2026-003', vendor: 'PT Piping Jaya Utama', item: 'Seamless Pipe Schedule 80 4"', qty: '450 Meters', total: '$36,000', status: 'ordered' as const, delivery: '2026-05-30', rating: 4.2 },
  { id: 'PO-2026-004', vendor: 'PT Jotun Indonesia', item: 'Jotamastic 90 Marine Primer', qty: '1,200 Liters', total: '$24,000', status: 'inspected' as const, delivery: '2026-04-10', rating: 4.9 },
  { id: 'PO-2026-005', vendor: 'PT Nippon Paint Maritim', item: 'Sea-Quantum Anti-Fouling Topcoat', qty: '800 Liters', total: '$28,000', status: 'ordered' as const, delivery: '2026-06-05', rating: 4.6 },
  { id: 'PO-2026-006', vendor: 'PT Marine Fittings Corp', item: 'Bollard 50T & Fairlead Fairing', qty: '8 Units', total: '$42,000', status: 'shipped' as const, delivery: '2026-05-22', rating: 4.3 },
]

const vendors = [
  { name: 'PT Krakatau Steel', category: 'Steel Plate', leadTime: '14 Days', onTimeRate: '96%', qualityScore: '4.8/5.0', priceLevel: 'Optimal' },
  { name: 'PT Gunawan Dianjaya', category: 'Steel Plate', leadTime: '21 Days', onTimeRate: '91%', qualityScore: '4.5/5.0', priceLevel: 'Competitive' },
  { name: 'PT Jotun Indonesia', category: 'Marine Paint', leadTime: '7 Days', onTimeRate: '98%', qualityScore: '4.9/5.0', priceLevel: 'Premium' },
]

export default function ProcurementMRP() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = purchaseOrders.filter((po) => {
    const matchSearch = po.item.toLowerCase().includes(search.toLowerCase()) || po.vendor.toLowerCase().includes(search.toLowerCase()) || po.id.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || po.status === filter
    return matchSearch && matchFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received': return <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> Received</span>
      case 'inspected': return <span className="badge badge-info"><CheckCircle size={10} className="mr-1" /> Inspected</span>
      case 'shipped': return <span className="badge badge-warning"><Truck size={10} className="mr-1" /> Shipped</span>
      default: return <span className="badge badge-neutral"><Clock size={10} className="mr-1" /> Ordered</span>
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Procurement & MRP</h1>
        <p className="text-sm text-slate-500 font-medium">Material Requirements Planning & Purchase Order Management</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active PO Value', value: '$429,000', sub: '6 active POs', color: 'text-blue-600' },
          { label: 'Material Delivered', value: '62%', sub: '205 Tons steel received', color: 'text-emerald-600' },
          { label: 'Pending Orders', value: '3 PO', sub: 'Est. delivery May 2026', color: 'text-amber-600' },
          { label: 'Vendor On-Time Rate', value: '94.8%', sub: 'Average delivery score', color: 'text-sky-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="glass-card rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PO, vendor, or material..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
        <div className="flex gap-1">
          {['all', 'ordered', 'shipped', 'received', 'inspected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'All' : f === 'ordered' ? 'Ordered' : f === 'shipped' ? 'Shipped' : f === 'received' ? 'Received' : 'Inspected'}
            </button>
          ))}
        </div>
      </div>

      {/* PO Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart size={16} className="text-blue-600" /> Purchase Orders Log
          </h2>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs">
            + Create New PO
          </button>
        </div>
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Vendor</th>
              <th>Material Description</th>
              <th>Qty</th>
              <th>Total Cost</th>
              <th>Delivery Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((po) => (
              <tr key={po.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{po.id}</td>
                <td className="font-semibold text-slate-800">{po.vendor}</td>
                <td>{po.item}</td>
                <td className="font-medium text-slate-700">{po.qty}</td>
                <td className="font-bold text-emerald-700">{po.total}</td>
                <td className="text-xs font-medium text-slate-500">{po.delivery}</td>
                <td>{getStatusBadge(po.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vendor Analysis */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 size={16} className="text-blue-600" /> Vendor Performance Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.map((v, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">{v.name}</h3>
                <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star size={12} fill="currentColor" /> {v.qualityScore}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">{v.category}</p>
              <div className="pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-medium">Lead Time</span>
                  <span className="font-bold text-slate-800">{v.leadTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">On-Time</span>
                  <span className="font-bold text-emerald-700">{v.onTimeRate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Price</span>
                  <span className="font-bold text-blue-700">{v.priceLevel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
