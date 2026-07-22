import { useState } from 'react'
import { Shield, CheckCircle, AlertTriangle, XCircle, FileText, AlertOctagon, Sparkles } from 'lucide-react'

const holdPoints = [
  { id: 'HP-001', step: 'Material Inspection', description: 'Steel plate mill certificate & thickness verification', inspector: 'BKI Surveyor & QC Lead', status: 'passed' as const, date: '2026-03-10' },
  { id: 'HP-002', step: 'Plate Cutting & Beveling', description: 'Bevel angle & edge alignment check', inspector: 'QC Inspector', status: 'passed' as const, date: '2026-03-22' },
  { id: 'HP-003', step: 'Hull Welding Joint B3', description: '100% NDT inspection on transverse watertight bulkhead', inspector: 'BKI Surveyor', status: 'hold' as const, date: '2026-05-18' },
  { id: 'HP-004', step: 'Surface Blasting Sa 2.5', description: 'Surface roughness & salt contamination test', inspector: 'Coating Inspector', status: 'pending' as const, date: '2026-06-01' },
  { id: 'HP-005', step: 'Tank Hydrostatic Testing', description: 'Watertight boundary pressure test', inspector: 'BKI Surveyor & Owner Representative', status: 'pending' as const, date: '2026-07-15' },
]

const ncrs = [
  { id: 'NCR-2026-001', item: 'Block A1 Joint B3-07', issue: 'Porosity defect exceeding BKI acceptance criteria (2.5mm)', severity: 'Major' as const, status: 'Open' as const, assignee: 'Ir. Sari (QC)' },
  { id: 'NCR-2026-002', item: 'Side Shell Plate B2', issue: 'Under-thickness coating DFT reading (185 µm vs 200 µm spec)', severity: 'Minor' as const, status: 'Resolved' as const, assignee: 'Painting Team Lead' },
]

export default function QAQCManagement() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">QA/QC Management</h1>
        <p className="text-sm text-slate-500 font-medium">Quality Assurance, Hold Point Verification & Non-Conformance (NCR) Tracking</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hold Points Verification', value: '2/5 Verified', color: 'text-blue-600' },
          { label: 'Quality Acceptance Pass Rate', value: '96.2%', color: 'text-emerald-600' },
          { label: 'Open Non-Conformances (NCR)', value: '1 Open NCR', color: 'text-red-600' },
          { label: 'BKI Audits Completed', value: '4 Audits', color: 'text-sky-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Hold Points Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield size={16} className="text-blue-600" /> Hold Point Inspection Test Plan (ITP)
          </h2>
          <span className="text-xs font-bold text-slate-500">BKI Classification Standard</span>
        </div>
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>Hold Point ID</th>
              <th>Production Milestone</th>
              <th>Inspection Description</th>
              <th>Required Inspector</th>
              <th>Target Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {holdPoints.map((hp) => (
              <tr key={hp.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{hp.id}</td>
                <td className="font-bold text-slate-900">{hp.step}</td>
                <td className="text-xs text-slate-700 font-medium">{hp.description}</td>
                <td className="text-xs font-semibold text-slate-800">{hp.inspector}</td>
                <td className="text-xs text-slate-500">{hp.date}</td>
                <td>
                  {hp.status === 'passed' ? (
                    <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> VERIFIED PASS</span>
                  ) : hp.status === 'hold' ? (
                    <span className="badge badge-danger"><AlertOctagon size={10} className="mr-1" /> QA HOLD</span>
                  ) : (
                    <span className="badge badge-neutral">PENDING</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NCR Tracker */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-600" /> Non-Conformance Reports (NCR) Tracking
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ncrs.map((ncr) => (
            <div key={ncr.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                  {ncr.id}
                </span>
                <span className={`badge ${ncr.status === 'Resolved' ? 'badge-success' : 'badge-danger'} text-[10px] uppercase font-bold`}>
                  {ncr.status}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">{ncr.item}</h3>
              <p className="text-xs text-slate-600 font-medium">{ncr.issue}</p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Severity: <strong className="text-slate-900">{ncr.severity}</strong></span>
                <span className="text-slate-500 font-medium">Assigned: <strong className="text-slate-800">{ncr.assignee}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
