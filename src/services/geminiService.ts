/**
 * Gemini API Service — Direct REST calls to Google AI Studio
 * Model: gemini-1.5-flash
 */

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.VITE_GEMINI_API_KEY : '') || '';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-3.5-flash';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// Module-specific system context for the AI assistant
const MODULE_CONTEXTS: Record<string, string> = {
  'project-management': `Anda adalah AI Assistant untuk modul Project Management di galangan kapal. Proyek aktif: Barge 300 FT - Project #001. Budget: $12.3B direncanakan vs $11.7B aktual. Anda memahami manajemen proyek pembangunan kapal, jadwal, milestone, dan anggaran.`,

  'engineering-management': `Anda adalah AI Assistant untuk modul Engineering Management di galangan kapal. Anda memahami gambar teknik kapal, CAD, version control gambar, standar BKI/IACS/ABS, dan proses persetujuan gambar teknik.`,

  'procurement': `Anda adalah AI Assistant untuk modul Procurement & MRP di galangan kapal. Anda memahami proses pengadaan material kapal, MRP (Material Requirements Planning), manajemen vendor, purchase order, dan estimasi biaya material.`,

  'material-tracking': `Anda adalah AI Assistant untuk modul Material Tracking di galangan kapal. Anda memahami pelacakan material (pelat baja, pipa, fitting), heat number, sertifikat material, QR code tracking, dan standar material maritim.`,

  'production-control': `Anda adalah AI Assistant untuk modul Production Control di galangan kapal. Proyek: Barge 300 FT mengikuti 27 tahap produksi dari Project Planning hingga Delivery. Anda memahami proses produksi kapal, assembly, welding, blasting, painting, outfitting, dan quality control.`,

  'welding': `Anda adalah AI Assistant untuk modul Welding Management di galangan kapal. Anda memahami WPS (Welding Procedure Specification), kualifikasi welder, NDT, standar pengelasan BKI/AWS/ASME, defect rate, dan repair welding.`,

  'painting': `Anda adalah AI Assistant untuk modul Painting Management di galangan kapal. Anda memahami DFT (Dry Film Thickness), surface preparation (Sa 2.5, Sa 3), paint system (primer, intermediate, topcoat), kondisi lingkungan pengecatan, dan standar coating maritim.`,

  'outfitting': `Anda adalah AI Assistant untuk modul Outfitting Management di galangan kapal. Anda memahami instalasi peralatan mekanik, elektrikal, pipa, HVAC, deck equipment, pre-commissioning, dan testing di kapal.`,

  'qa-qc': `Anda adalah AI Assistant untuk modul QA/QC Management di galangan kapal. Anda memahami inspection checklist, hold point inspection, ITP (Inspection Test Plan), NCR (Non-Conformance Report), dan standar kualitas BKI/IACS.`,

  'surveyor-ai': `Anda adalah AI Surveyor Engine untuk inspeksi kapal. Anda dapat menganalisis deskripsi foto inspeksi dan memberikan penilaian terstruktur tentang kondisi, defect, severity, dan rekomendasi perbaikan berdasarkan standar BKI dan IACS.`,

  'ndt': `Anda adalah AI Assistant untuk modul NDT Management di galangan kapal. Anda memahami Radiography Testing (RT), Ultrasonic Testing (UT), Magnetic Particle Testing (MT), Dye Penetrant Testing (PT), standar NDT, dan interpretasi hasil.`,

  'document-mgmt': `Anda adalah AI Assistant untuk modul Document Management di galangan kapal. Anda memahami sertifikat kelas (BKI, IACS, ABS), dokumen statutory, drawing management, dan compliance document tracking.`,

  'launching': `Anda adalah AI Assistant untuk modul Launching Management di galangan kapal. Anda memahami metode peluncuran kapal (airbag, slipway, floating dock), perhitungan stabilitas peluncuran, safety checklist, dan prosedur launching.`,

  'sea-trial': `Anda adalah AI Assistant untuk modul Sea Trial Management di galangan kapal. Anda memahami uji stabilitas, draft mark reading, speed trial, towing trial, maneuvering test, dan prosedur sea trial sesuai standar BKI.`,

  'ceo-dashboard': `Anda adalah AI Executive Assistant untuk CEO Dashboard galangan kapal. Proyek: Barge 300 FT - progress 82%. Budget: $12.3B planned vs $11.7B actual. Anda memberikan ringkasan eksekutif, analisis KPI, trend, dan rekomendasi strategis.`,

  'ai-maritime': `Anda adalah AI Maritime Expert dengan pengetahuan mendalam tentang:
- Peraturan BKI (Biro Klasifikasi Indonesia) untuk semua jenis kapal
- Standar IACS (International Association of Classification Societies)
- Aturan ABS (American Bureau of Shipping)  
- SOP galangan kapal
- Proses pembangunan kapal dari desain hingga delivery
- Standar pengelasan, pengecatan, dan outfitting maritim
- Uji tangki, sea trial, dan prosedur launching
- Keselamatan kerja di galangan kapal
Berikan jawaban komprehensif dalam Bahasa Indonesia formal.`,
};

const BASE_SYSTEM_PROMPT = `Anda adalah ShipyardOS AI Assistant — asisten cerdas untuk platform manajemen galangan kapal enterprise. Selalu jawab dalam Bahasa Indonesia formal yang profesional. Berikan jawaban yang terstruktur, informatif, dan actionable. Gunakan format markdown jika perlu (heading, list, tabel, bold).`;

/**
 * Generate content from Gemini API
 */
export async function generateContent(
  prompt: string,
  moduleId?: string,
  conversationHistory?: GeminiMessage[]
): Promise<string> {
  const systemContext = moduleId ? MODULE_CONTEXTS[moduleId] || '' : '';
  const fullSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${systemContext}`.trim();

  const contents: GeminiMessage[] = [];

  // Add system context as first message
  if (fullSystemPrompt) {
    contents.push({
      role: 'user',
      parts: [{ text: `[System Context]: ${fullSystemPrompt}` }],
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'Dipahami. Saya siap membantu sebagai ShipyardOS AI Assistant dengan konteks yang diberikan.' }],
    });
  }

  // Add conversation history
  if (conversationHistory && conversationHistory.length > 0) {
    contents.push(...conversationHistory);
  }

  // Add current prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }],
  });

  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API Error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response text from Gemini');
    return text;
  } catch (error) {
    console.error('[GeminiService] Error:', error);
    throw error;
  }
}

/**
 * Analyze inspection image (simulated — sends description to Gemini for structured analysis)
 */
export async function analyzeInspection(defectDescription: string): Promise<string> {
  const prompt = `Anda adalah AI Surveyor untuk inspeksi kapal. Berikut deskripsi temuan inspeksi visual:

"${defectDescription}"

Berikan analisis terstruktur dalam format berikut:

## 📋 Hasil Analisis Inspeksi AI

### Identifikasi Temuan
- **Jenis Defect**: [identifikasi jenis defect]
- **Lokasi**: [estimasi lokasi pada struktur kapal]  
- **Severity Level**: [Critical/Major/Minor]
- **Kode Referensi BKI**: [kode yang relevan]

### Penilaian Kondisi
- **Rating Kondisi**: [1-10, dengan 10 = sempurna]
- **Dampak Struktural**: [tinggi/sedang/rendah]
- **Urgensi Perbaikan**: [segera/terjadwal/monitoring]

### Rekomendasi Tindakan
1. [Tindakan perbaikan utama]
2. [Tindakan pencegahan]
3. [Follow-up inspection]

### Standar Acuan
- BKI: [referensi aturan]
- IACS: [referensi yang relevan]

### Status Keputusan
**REKOMENDASI**: [LULUS / LULUS BERSYARAT / DITOLAK]`;

  return generateContent(prompt, 'surveyor-ai');
}

/**
 * Generate executive summary for CEO Dashboard
 */
export async function generateExecutiveSummary(): Promise<string> {
  const prompt = `Buatkan ringkasan eksekutif untuk CEO tentang proyek pembangunan Barge 300 FT - Project #001 dengan data berikut:

**Status Proyek:**
- Progress keseluruhan: 82%
- Budget direncanakan: $12.3 Miliar
- Budget aktual: $11.7 Miliar (efisiensi 4.9%)
- Timeline: On Track, estimasi selesai Q4 2026
- Safety Record: 450 hari tanpa kecelakaan kerja

**Status Produksi:**
- 5 dari 27 tahap selesai
- 3 tahap sedang berlangsung (Plate Preparation, Sub-Assembly, Welding Hull)
- 1 tahap QA Hold (Final Inspection - menunggu review surveyor)
- 18 tahap pending

**KPI Terkini:**
- Welding defect rate: 2.1% (target < 3%)
- DFT compliance: 98.5%
- Material utilization: 94.2%
- Worker productivity: 91%

Berikan:
1. Ringkasan eksekutif (2-3 paragraf)
2. Highlight pencapaian
3. Risiko dan perhatian
4. Rekomendasi strategis
5. Outlook ke depan

Format dalam markdown yang rapi dan profesional.`;

  return generateContent(prompt, 'ceo-dashboard');
}

/**
 * Check if Gemini API is reachable
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export { MODULE_CONTEXTS, BASE_SYSTEM_PROMPT, GEMINI_API_KEY, MODEL };
