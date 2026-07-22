import { useState } from 'react'
import { Settings, CheckCircle, Clock, Anchor, ShieldCheck, Zap, Activity } from 'lucide-react'

const outfittingItems = [
  { id: 'OFT-001', category: 'Deck Equipment', name: 'Anchor Windlass 50T Hydraulic', location: 'Foredeck', status: 'installed' as const, certNo: 'BKI-EQ-2026-101', vendor: 'PT Marine Machinery' },
  { id: 'OFT-002', category: 'Deck Equipment', name: 'Towing Bitt & Fairlead Assembly', location: 'Aft Deck', status: 'installed' as const, certNo: 'BKI-EQ-2026-102', vendor: 'PT Deck Equipment Indo' },
  { id: 'OFT-003', category: 'Piping & Valves', name: 'Ballast System Valve Manifold 6"', location: 'Pump Room', status: 'testing' as const, certNo: 'BKI-EQ-2026-105', vendor: 'PT Piping Jaya' },
  { id: 'OFT-004', category: 'Electrical', name: 'Main Switchboard (MSB) 440V', location: 'Engine Control Room', status: 'installed' as const, certNo: 'BKI-EL-2026-201', vendor: 'PT Marine Electric' },
  { id: 'OFT-005', category: 'Safety & Life-Saving', name: 'Inflatable Life Raft 25 Person (x2)', location: 'Bridge Deck', status: 'pending' as const, certNo: 'SOLAS-CRT-2026', vendor: 'PT Safety Marine' },
]

export default function OutfittingManagement() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Outfitting Management</h1>
        <p className="text-sm text-slate-500 font-medium">Mechanical, Electrical, Deck & Safety Equipment Installation — 300 FT Barge</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Outfitting Equipment', value: '42 Units', color: 'text-blue-600' },
          { label: 'Installed & Verified', value: '28 Units', color: 'text-emerald-600' },
          { label: 'Under Commissioning', value: '6 Systems', color: 'text-sky-600' },
          { label: 'Pending Delivery', value: '8 Units', color: 'text-slate-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Outfitting Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Settings size={16} className="text-blue-600" /> Outfitting Equipment & Components Schedule
          </h2>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs">
            + Register Outfitting Unit
          </button>
        </div>
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Equipment Category</th>
              <th>Equipment Name</th>
              <th>Installation Location</th>
              <th>Vendor</th>
              <th>Class Certificate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {outfittingItems.map((item) => (
              <tr key={item.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{item.id}</td>
                <td className="text-xs font-semibold text-slate-600">{item.category}</td>
                <td className="font-bold text-slate-900">{item.name}</td>
                <td className="text-xs text-slate-700">{item.location}</td>
                <td className="text-xs text-slate-600">{item.vendor}</td>
                <td className="font-mono text-xs text-slate-700">{item.certNo}</td>
                <td>
                  {item.status === 'installed' ? (
                    <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> Installed</span>
                  ) : item.status === 'testing' ? (
                    <span className="badge badge-info"><Activity size={10} className="mr-1 animate-spin" /> Testing</span>
                  ) : (
                    <span className="badge badge-neutral"><Clock size={10} className="mr-1" /> Pending</span>
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
