import { useState } from 'react'
import { CheckCircle, Zap, AlertCircle, Circle, X, Users, FileText, Clock } from 'lucide-react'
import type { ProductionStep } from '../../types'

interface ProductionControlProps {
  steps: ProductionStep[]
}

export default function ProductionControl({ steps }: ProductionControlProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null)

  const getStatusIcon = (status: string, size = 20) => {
    switch (status) {
      case 'done': return <CheckCircle size={size} className="text-emerald-600" />
      case 'in-progress': return <Zap size={size} className="text-blue-600" />
      case 'qa-hold': return <AlertCircle size={size} className="text-red-600" />
      default: return <Circle size={size} className="text-slate-400" />
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'done': return 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400 text-emerald-900'
      case 'in-progress': return 'bg-blue-50/70 border-blue-200 hover:border-blue-400 text-blue-900'
      case 'qa-hold': return 'bg-red-50/80 border-red-200 hover:border-red-400 text-red-900 animate-pulse-red'
      default: return 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done': return { text: 'Selesai', cls: 'badge-success' }
      case 'in-progress': return { text: 'Dalam Proses', cls: 'badge-info' }
      case 'qa-hold': return { text: 'QA Hold', cls: 'badge-danger' }
      default: return { text: 'Pending', cls: 'badge-neutral' }
    }
  }

  const doneCount = steps.filter((s) => s.status === 'done').length
  const inProgressCount = steps.filter((s) => s.status === 'in-progress').length
  const qaHoldCount = steps.filter((s) => s.status === 'qa-hold').length
  const pendingCount = steps.length - doneCount - inProgressCount - qaHoldCount
  const progress = Math.round((doneCount / steps.length) * 100)

  const selectedStepData = steps.find((s) => s.id === selectedStep)

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Production Control — 27 Tahap Produksi</h1>
        <p className="text-sm text-slate-500 font-medium">Barge 300 FT — Project #001 | Progress: {progress}%</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Selesai', value: doneCount, color: 'text-emerald-700', bg: 'bg-emerald-50/60', border: 'border-emerald-200' },
          { label: 'Dalam Proses', value: inProgressCount, color: 'text-blue-700', bg: 'bg-blue-50/60', border: 'border-blue-200' },
          { label: 'QA Hold', value: qaHoldCount, color: 'text-red-700', bg: 'bg-red-50/60', border: 'border-red-200' },
          { label: 'Pending', value: pendingCount, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
        ].map((s, i) => (
          <div key={i} className={`glass-card rounded-xl p-4 ${s.bg} border ${s.border}`}>
            <p className="text-xs font-semibold text-slate-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Progress Produksi Keseluruhan</h3>
          <span className="text-lg font-bold text-blue-700">{progress}%</span>
        </div>
        <div className="progress-bar h-3">
          <div className="progress-bar-fill bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 27 Steps Grid */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-4">27 Tahap Pembangunan Kapal</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {steps.map((step) => {
            const label = getStatusLabel(step.status)
            return (
              <button
                key={step.id}
                onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                className={`border rounded-xl p-3 transition-all clickable-card shadow-xs ${getStatusStyle(step.status)} ${
                  selectedStep === step.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(step.status, 16)}
                  <span className="text-xs font-bold text-slate-900">#{step.id}</span>
                </div>
                <p className="text-[11px] text-slate-800 text-left leading-tight mb-2 font-medium">{step.nameId}</p>
                <span className={`badge ${label.cls} text-[10px]`}>{label.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step Detail Drawer */}
      {selectedStepData && (
        <div className="glass-card rounded-xl p-5 border border-blue-300 bg-blue-50/20 slide-in shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {getStatusIcon(selectedStepData.status, 18)}
              Tahap #{selectedStepData.id}: {selectedStepData.nameId}
            </h3>
            <button onClick={() => setSelectedStep(null)} className="p-1 hover:bg-slate-200/60 rounded text-slate-500 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Status</span>
              </div>
              <span className={`badge ${getStatusLabel(selectedStepData.status).cls}`}>
                {getStatusLabel(selectedStepData.status).text}
              </span>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Durasi Estimasi</span>
              </div>
              <p className="text-sm text-slate-900 font-bold">5-7 hari kerja</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={14} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Progress</span>
              </div>
              <p className="text-sm text-blue-700 font-bold">{selectedStepData.progress}%</p>
            </div>
          </div>

          {/* Workers */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <Users size={13} className="text-slate-500" /> Pekerja Ditugaskan
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedStepData.workers.map((w, i) => (
                <span key={i} className="px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-slate-700 border border-slate-200 shadow-xs">{w}</span>
              ))}
            </div>
          </div>

          {/* Inspection Logs */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <FileText size={13} className="text-slate-500" /> Log Inspeksi
            </h4>
            {selectedStepData.inspectionLogs.length > 0 ? (
              <div className="space-y-2">
                {selectedStepData.inspectionLogs.map((log, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <div className={`w-2.5 h-2.5 rounded-full ${log.result === 'pass' ? 'bg-emerald-500' : log.result === 'fail' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-900 font-bold">{log.inspector}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{log.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">{log.notes}</p>
                    </div>
                    <span className={`badge text-[10px] ${log.result === 'pass' ? 'badge-success' : log.result === 'fail' ? 'badge-danger' : 'badge-warning'}`}>
                      {log.result === 'pass' ? 'Lulus' : log.result === 'fail' ? 'Gagal' : 'Bersyarat'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Belum ada log inspeksi untuk tahap ini.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
