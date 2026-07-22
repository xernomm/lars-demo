import { useState } from 'react'
import { CheckCircle2, Clock, AlertOctagon, User, Calendar, FileText, ChevronRight, Activity } from 'lucide-react'
import type { ProductionStep } from '../../types'

interface ProductionControlProps {
  steps: ProductionStep[]
}

export default function ProductionControl({ steps }: ProductionControlProps) {
  const [selectedStep, setSelectedStep] = useState<ProductionStep | null>(steps[7] || steps[0])

  const getStatusBadge = (status: ProductionStep['status']) => {
    switch (status) {
      case 'done':
        return <span className="badge badge-success"><CheckCircle2 size={11} className="mr-1" /> Completed</span>
      case 'in-progress':
        return <span className="badge badge-info"><Activity size={11} className="mr-1 animate-spin" /> In Progress</span>
      case 'qa-hold':
        return <span className="badge badge-danger"><AlertOctagon size={11} className="mr-1" /> QA Hold</span>
      default:
        return <span className="badge badge-neutral"><Clock size={11} className="mr-1" /> Pending</span>
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Production Control</h1>
        <p className="text-sm text-slate-500 font-medium">27 Production Steps Execution & Inspection Tracking — 300 FT Barge</p>
      </div>

      {/* Steps List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps Column */}
        <div className="lg:col-span-2 glass-card rounded-xl p-4 max-h-[700px] overflow-y-auto space-y-2">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 sticky top-0 bg-white z-10">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Production Steps (27 Total)</h2>
            <span className="text-xs font-bold text-blue-600">
              {steps.filter(s => s.status === 'done').length}/27 Completed
            </span>
          </div>

          {steps.map((step) => {
            const isSelected = selectedStep?.id === step.id
            return (
              <div
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    step.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                    step.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    step.status === 'qa-hold' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{step.id}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{step.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{step.workers.slice(0, 2).join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 hidden sm:block">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          step.status === 'done' ? 'bg-emerald-500' :
                          step.status === 'qa-hold' ? 'bg-red-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  </div>
                  {getStatusBadge(step.status)}
                  <ChevronRight size={14} className="text-slate-400" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail Panel */}
        {selectedStep && (
          <div className="glass-card rounded-xl p-5 space-y-4 h-fit sticky top-4 border-2 border-blue-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Step #{selectedStep.id} Detail</span>
                <h2 className="text-lg font-bold text-slate-900">{selectedStep.name}</h2>
              </div>
              {getStatusBadge(selectedStep.status)}
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Progress Completion</span>
                <span className="text-blue-700">{selectedStep.progress}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedStep.status === 'done' ? 'bg-emerald-500' :
                    selectedStep.status === 'qa-hold' ? 'bg-red-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${selectedStep.progress}%` }}
                />
              </div>
            </div>

            {/* Personnel */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <User size={14} className="text-blue-600" /> Assigned Personnel
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedStep.workers.map((w, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700">
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* Inspection Logs */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-blue-600" /> Inspection & QA History
              </h3>
              {selectedStep.inspectionLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-lg border border-slate-100">
                  No inspection logs recorded for this step yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {selectedStep.inspectionLogs.map((log, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Calendar size={11} className="text-slate-400" /> {log.date}
                        </span>
                        <span className={`badge ${
                          log.result === 'pass' ? 'badge-success' : log.result === 'conditional' ? 'badge-warning' : 'badge-danger'
                        } text-[10px] uppercase font-bold`}>
                          {log.result}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] font-medium">{log.notes}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Inspector: {log.inspector}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
