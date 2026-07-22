import { useState } from 'react'
import { Camera, Sparkles, AlertTriangle, ShieldCheck, FileCheck, CheckCircle, Loader2 } from 'lucide-react'
import { analyzeInspection } from '../../services/geminiService'
import MarkdownRenderer from '../MarkdownRenderer'

const presets = [
  {
    title: 'Porosity & Lack of Fusion on Hull Butt Joint',
    desc: 'Visual inspection of Transverse Bulkhead B3 weld joint reveals clustered surface porosity and incomplete penetration along a 45mm weld length.',
    category: 'Welding Defect',
  },
  {
    title: 'Coating Blistering & Under-thickness on Side Shell',
    desc: 'Paint inspection on Starboard Side Shell Block B2 shows localized osmotic blistering and Dry Film Thickness (DFT) reading of 160 µm against 220 µm spec.',
    category: 'Coating Failure',
  },
  {
    title: 'Excessive Plate Distortion on Foredeck Structure',
    desc: 'Post-welding dimensional inspection on Foredeck Plate B1-04 exhibits 14mm heat-induced angular distortion exceeding BKI structural tolerances (max 8mm).',
    category: 'Structural Distortion',
  },
]

export default function SurveyorAIEngine() {
  const [inputDesc, setInputDesc] = useState(presets[0].desc)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async (descToUse?: string) => {
    const text = descToUse || inputDesc
    if (!text.trim() || isAnalyzing) return
    setIsAnalyzing(true)
    try {
      const result = await analyzeInspection(text)
      setAnalysisResult(result)
    } catch {
      setAnalysisResult('⚠️ Failed to run AI Surveyor analysis. Please check your internet connection or API settings.')
    }
    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Camera className="text-emerald-600" /> Surveyor AI Engine
        </h1>
        <p className="text-sm text-slate-500 font-medium">Automated BKI & IACS Visual Inspection Assessment & Repair Recommendations</p>
      </div>

      {/* Preset Scenarios */}
      <div className="glass-card rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={14} className="text-emerald-600" /> Select Preset Inspection Defect Scenario:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => { setInputDesc(p.desc); handleAnalyze(p.desc); }}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all group shadow-xs"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 mb-1.5 inline-block">
                {p.category}
              </span>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">{p.title}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-medium">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input Form */}
      <div className="glass-card rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Custom Inspection Defect Description:</h2>
        <textarea
          value={inputDesc}
          onChange={(e) => setInputDesc(e.target.value)}
          rows={3}
          placeholder="Enter detailed description of inspection findings, weld defects, corrosion, or dimensional variances..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
        />
        <div className="flex justify-end">
          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing || !inputDesc.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            {isAnalyzing ? 'Running AI Surveyor Assessment...' : 'Run AI Surveyor Inspection Analysis'}
          </button>
        </div>
      </div>

      {/* Analysis Output */}
      {analysisResult && (
        <div className="glass-card rounded-xl p-6 border-2 border-emerald-200 bg-emerald-50/20 slide-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-200/60">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">BKI & IACS Classification Assessment Report</h2>
            </div>
            <span className="badge badge-success text-xs font-bold">AI Survey Complete</span>
          </div>

          <MarkdownRenderer content={analysisResult} />
        </div>
      )}
    </div>
  )
}
