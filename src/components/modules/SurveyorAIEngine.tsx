import { useState } from 'react'
import { Camera, Loader2, Upload, Sparkles, Image } from 'lucide-react'
import { analyzeInspection } from '../../services/geminiService'
import MarkdownRenderer from '../MarkdownRenderer'

const presetDefects = [
  { id: 1, label: 'Korosi permukaan pada pelat lambung bawah air', description: 'Ditemukan korosi general pada pelat lambung di area waterline, kedalaman korosi sekitar 1.5mm pada pelat dengan tebal original 12mm. Area terdampak sekitar 2m x 1.5m. Terlihat juga pitting corrosion pada beberapa titik.' },
  { id: 2, label: 'Retak pada sambungan las blok A3', description: 'Terdeteksi retak transversal pada sambungan las butt joint antara blok A3 dan A4. Panjang retak sekitar 150mm. Retak terlihat dari permukaan dan kemungkinan menembus ke root. Lokasi pada frame 45 portside.' },
  { id: 3, label: 'Deformasi pelat deck area cargo hold', description: 'Ditemukan deformasi (buckling) pada pelat deck di area cargo hold no.2. Deformasi berbentuk panel buckle dengan depth sekitar 25mm pada panel 2m x 3m. Tebal pelat 10mm.' },
  { id: 4, label: 'Kerusakan cat pada ballast tank no.3', description: 'Coating breakdown pada ballast tank no.3 starboard. Area terdampak sekitar 40% dari total luasan. Terlihat rust staining, blistering, dan peeling. Coating system original adalah epoxy tar 2 coat.' },
  { id: 5, label: 'Cacat pengelasan — porositas pada fillet weld', description: 'Ditemukan porositas cluster pada fillet weld bracket frame 52 starboard. Ukuran pore terbesar sekitar 3mm diameter. Cluster sepanjang 80mm. Proses las FCAW, material AH36.' },
]

export default function SurveyorAIEngine() {
  const [selectedDefect, setSelectedDefect] = useState<typeof presetDefects[0] | null>(null)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [customDesc, setCustomDesc] = useState('')

  const handleAnalyze = async () => {
    const description = selectedDefect?.description || customDesc
    if (!description.trim()) return

    setIsAnalyzing(true)
    setAnalysisResult(null)
    try {
      const result = await analyzeInspection(description)
      setAnalysisResult(result)
    } catch {
      setAnalysisResult('⚠️ Gagal menganalisis. Silakan coba lagi.')
    }
    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Camera size={28} className="text-emerald-600" />
          Surveyor AI Engine
        </h1>
        <p className="text-sm text-slate-500 font-medium">Analisis Inspeksi Visual dengan Gemini AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Upload / Select */}
        <div className="space-y-4">
          {/* Preset Defects */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Image size={16} className="text-emerald-600" />
              Pilih Skenario Inspeksi
            </h3>
            <div className="space-y-2">
              {presetDefects.map((defect) => (
                <button
                  key={defect.id}
                  onClick={() => { setSelectedDefect(defect); setCustomDesc('') }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedDefect?.id === defect.id
                      ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-900">{defect.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Description */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Upload size={16} className="text-blue-600" />
              Atau Deskripsikan Temuan Manual
            </h3>
            <textarea
              value={customDesc}
              onChange={(e) => { setCustomDesc(e.target.value); setSelectedDefect(null) }}
              placeholder="Deskripsikan temuan inspeksi visual secara detail (lokasi, jenis defect, ukuran, kondisi)..."
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!selectedDefect && !customDesc.trim())}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl text-sm font-bold hover:from-emerald-500 hover:to-teal-400 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <><Loader2 size={16} className="animate-spin" /> Gemini AI Menganalisis...</>
            ) : (
              <><Sparkles size={16} /> Analisa dengan Gemini AI</>
            )}
          </button>
        </div>

        {/* Right — Results */}
        <div className="space-y-4">
          {(selectedDefect || customDesc) && (
            <div className="glass-card rounded-xl p-5 border border-blue-200 bg-blue-50/20">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Deskripsi Temuan</h3>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">{selectedDefect?.description || customDesc}</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="glass-card rounded-xl p-8 text-center border border-emerald-200">
              <Sparkles size={36} className="text-emerald-600 mx-auto mb-3 animate-pulse" />
              <p className="text-sm text-slate-900 font-bold">Gemini AI sedang menganalisis...</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Menggunakan model gemini-3.5-flash</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="glass-card rounded-xl p-5 border border-emerald-300 bg-emerald-50/20 slide-in">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-emerald-100">
                <Sparkles size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Hasil Analisis Gemini AI</h3>
              </div>
              <MarkdownRenderer content={analysisResult} />
            </div>
          )}

          {!selectedDefect && !customDesc && !analysisResult && (
            <div className="glass-card rounded-xl p-12 text-center border border-dashed border-slate-200">
              <Camera size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500">Pilih skenario inspeksi atau deskripsikan temuan untuk memulai analisis AI</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
