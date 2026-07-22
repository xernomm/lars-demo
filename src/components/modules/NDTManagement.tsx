import { useState } from 'react'
import { Microscope, CheckCircle, AlertOctagon, FileCheck, Layers } from 'lucide-react'

const ndtLogs = [
  { id: 'NDT-001', joint: 'Bulkhead B3-07 Joint', method: 'RT (Radiographic Testing)', result: 'FAIL - Porosity > 2.5mm', inspector: 'NDT Level II (Rudi)', date: '2026-05-18', status: 'fail' as const },
  { id: 'NDT-002', joint: 'Side Shell Plate B2-12', method: 'UT (Ultrasonic Testing)', result: 'PASS - Full Penetration', inspector: 'NDT Level II (Hadi)', date: '2026-05-15', status: 'pass' as const },
  { id: 'NDT-003', joint: 'Deck Stiffener D1-04', method: 'MT (Magnetic Particle)', result: 'PASS - No Surface Cracks', inspector: 'NDT Level II (Rudi)', date: '2026-05-10', status: 'pass' as const },
  { id: 'NDT-004', joint: 'Engine Bed Girders', method: 'PT (Dye Penetrant)', result: 'PASS - Indication Free', inspector: 'NDT Level II (Hadi)', date: '2026-05-02', status: 'pass' as const },
]

export default function NDTManagement() {
  const [selectedJoint, setSelectedJoint] = useState<typeof ndtLogs[0] | null>(ndtLogs[0])

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">NDT Management</h1>
        <p className="text-sm text-slate-500 font-medium">Non-Destructive Testing (RT, UT, MT, PT) Mapping & Inspection Logs</p>
      </div>

      {/* Hull Diagram Visualizer */}
      <div className="glass-card rounded-xl p-5 border border-slate-200">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers size={16} className="text-blue-600" /> Hull Structure Cross-Section NDT Map (300 FT Barge)
        </h2>
        <div className="relative h-56 bg-slate-900 rounded-xl p-4 flex items-center justify-center overflow-hidden border border-slate-800">
          {/* Hull outline mockup */}
          <div className="w-full h-40 border-4 border-blue-400/80 rounded-b-3xl relative flex items-center justify-center">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest">DECK STRUCTURE</span>

            {/* Defect marker 1 - Fail */}
            <button
              onClick={() => setSelectedJoint(ndtLogs[0])}
              className="absolute top-12 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center animate-ping-slow shadow-lg cursor-pointer hover:scale-125 transition-transform"
              title="Bulkhead B3-07 Joint (RT FAIL)"
            >
              !
            </button>

            {/* Defect marker 2 - Pass */}
            <button
              onClick={() => setSelectedJoint(ndtLogs[1])}
              className="absolute top-20 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shadow-lg cursor-pointer hover:scale-125 transition-transform"
              title="Side Shell B2-12 (UT PASS)"
            >
              ✓
            </button>

            <div className="absolute bottom-2 text-[10px] text-slate-400 font-mono">BOTTOM SHELL PLATE</div>
          </div>
        </div>
      </div>

      {/* Selected NDT Log Detail */}
      {selectedJoint && (
        <div className={`glass-card rounded-xl p-5 border-2 ${selectedJoint.status === 'fail' ? 'border-red-200 bg-red-50/40' : 'border-emerald-200 bg-emerald-50/40'} slide-in`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Microscope size={18} className={selectedJoint.status === 'fail' ? 'text-red-600' : 'text-emerald-600'} />
              <h3 className="text-sm font-bold text-slate-900">NDT Joint Inspection — {selectedJoint.joint}</h3>
            </div>
            <span className={`badge ${selectedJoint.status === 'fail' ? 'badge-danger' : 'badge-success'} text-xs font-bold uppercase`}>
              {selectedJoint.status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-3">
            <div>
              <span className="text-slate-500 block font-medium">Test Method</span>
              <span className="font-bold text-slate-900">{selectedJoint.method}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Test Findings</span>
              <span className="font-semibold text-slate-800">{selectedJoint.result}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Certified Inspector</span>
              <span className="font-semibold text-blue-700">{selectedJoint.inspector}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Inspection Date</span>
              <span className="font-mono text-slate-700">{selectedJoint.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* NDT Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xs">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Joint Location</th>
              <th>NDT Method</th>
              <th>Inspection Result</th>
              <th>Certified Inspector</th>
              <th>Test Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ndtLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedJoint(log)}>
                <td className="font-mono text-blue-700 font-bold text-xs">{log.id}</td>
                <td className="font-semibold text-slate-800">{log.joint}</td>
                <td className="text-xs text-slate-700 font-medium">{log.method}</td>
                <td className="text-xs font-bold text-slate-900">{log.result}</td>
                <td className="text-xs text-slate-600 font-medium">{log.inspector}</td>
                <td className="text-xs font-mono text-slate-500">{log.date}</td>
                <td>
                  {log.status === 'pass' ? (
                    <span className="badge badge-success"><CheckCircle size={10} className="mr-1" /> PASS</span>
                  ) : (
                    <span className="badge badge-danger"><AlertOctagon size={10} className="mr-1" /> FAIL</span>
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
