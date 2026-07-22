import { useState } from 'react'
import { FileText, Folder, Search, Download, Eye, ShieldCheck, CheckCircle, Clock, FilePlus } from 'lucide-react'

const documents = [
  { id: 'DOC-001', name: 'BKI Interim Class Certificate - Hull', category: 'Class Certificates', format: 'PDF', size: '2.4 MB', date: '2026-01-15', status: 'valid' as const, certNo: 'BKI-CRT-2026-101' },
  { id: 'DOC-002', name: 'Statutory Load Line Certificate', category: 'Statutory Certificates', format: 'PDF', size: '1.8 MB', date: '2026-02-01', status: 'valid' as const, certNo: 'STAT-LL-2026-08' },
  { id: 'DOC-003', name: 'BKI Approved General Arrangement Drawing', category: 'Engineering Drawings', format: 'DWG / PDF', size: '14.5 MB', date: '2026-02-15', status: 'valid' as const, certNo: 'BKI-DWG-GA-01' },
  { id: 'DOC-004', name: 'NDT Radiographic Inspection Reports', category: 'Survey Reports', format: 'ZIP', size: '8.2 MB', date: '2026-05-18', status: 'pending' as const, certNo: 'NDT-REP-2026-12' },
  { id: 'DOC-005', name: 'Mill Test Certificates - Steel Plate AH36', category: 'Material Certificates', format: 'PDF', size: '5.1 MB', date: '2026-03-10', status: 'valid' as const, certNo: 'MTC-KS-2026-99' },
]

export default function DocumentManagement() {
  const [search, setSearch] = useState('')

  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    d.certNo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Document Management</h1>
        <p className="text-sm text-slate-500 font-medium">BKI Classification & Statutory Certificate Repository — 300 FT Barge</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: '128 Files', color: 'text-blue-600' },
          { label: 'Valid Class Certificates', value: '12 Verified', color: 'text-emerald-600' },
          { label: 'Pending Endorsements', value: '2 Documents', color: 'text-amber-600' },
          { label: 'Storage Used', value: '1.2 GB', color: 'text-slate-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document name, certificate number, or category..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs">
          <FilePlus size={15} /> Upload New Document
        </button>
      </div>

      {/* Document Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Document Title</th>
              <th>Category</th>
              <th>Format / Size</th>
              <th>Certificate No</th>
              <th>Date Uploaded</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr key={doc.id}>
                <td className="font-mono text-blue-700 font-bold text-xs">{doc.id}</td>
                <td className="font-bold text-slate-900 flex items-center gap-2">
                  <FileText size={15} className="text-blue-500 flex-shrink-0" /> {doc.name}
                </td>
                <td className="text-xs text-slate-600 font-medium">{doc.category}</td>
                <td className="text-xs font-mono text-slate-500">{doc.format} • {doc.size}</td>
                <td className="font-mono text-xs font-bold text-emerald-700">{doc.certNo}</td>
                <td className="text-xs font-mono text-slate-500">{doc.date}</td>
                <td>
                  {doc.status === 'valid' ? (
                    <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> VALID</span>
                  ) : (
                    <span className="badge badge-warning"><Clock size={10} className="mr-1" /> PENDING</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors" title="View Document">
                      <Eye size={15} />
                    </button>
                    <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600 hover:text-blue-700 transition-colors" title="Download File">
                      <Download size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
