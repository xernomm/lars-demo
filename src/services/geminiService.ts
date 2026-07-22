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
  'project-management': `You are an AI Assistant for the Project Management module in a shipyard enterprise. Active project: 300 FT Barge - Project #001. Budget: $12.3B planned vs $11.7B actual. You understand shipbuilding project management, schedules, milestones, and budgeting.`,

  'engineering-management': `You are an AI Assistant for the Engineering Management module in a shipyard enterprise. You understand ship engineering drawings, CAD files, drawing version control, BKI/IACS/ABS standards, and engineering approval workflows.`,

  'procurement': `You are an AI Assistant for the Procurement & MRP module in a shipyard enterprise. You understand marine material procurement, MRP (Material Requirements Planning), vendor management, purchase orders, and cost estimation.`,

  'material-tracking': `You are an AI Assistant for the Material Tracking module in a shipyard enterprise. You understand material traceability (steel plates, pipes, fittings), heat numbers, material certificates, QR code tracking, and maritime material standards.`,

  'production-control': `You are an AI Assistant for the Production Control module in a shipyard enterprise. Project: 300 FT Barge follows 27 production steps from Project Planning to Delivery. You understand vessel production workflows, assembly, welding, blasting, painting, outfitting, and quality control.`,

  'welding': `You are an AI Assistant for the Welding Management module in a shipyard enterprise. You understand WPS (Welding Procedure Specification), welder qualifications, NDT, BKI/AWS/ASME welding standards, defect rates, and repair welding.`,

  'painting': `You are an AI Assistant for the Painting Management module in a shipyard enterprise. You understand DFT (Dry Film Thickness) measurements, surface preparation standards (Sa 2.5, Sa 3), coating systems (primer, intermediate, topcoat), ambient painting conditions, and marine coating specifications.`,

  'outfitting': `You are an AI Assistant for the Outfitting Management module in a shipyard enterprise. You understand mechanical equipment installation, electrical systems, piping, HVAC, deck equipment, pre-commissioning, and shipboard testing.`,

  'qa-qc': `You are an AI Assistant for the QA/QC Management module in a shipyard enterprise. You understand inspection checklists, hold point inspections, ITP (Inspection Test Plan), NCR (Non-Conformance Report), and BKI/IACS quality assurance standards.`,

  'surveyor-ai': `You are the AI Surveyor Engine for ship inspections. You analyze visual inspection descriptions and photos to provide structured assessments including condition, defects, severity ratings, and corrective recommendations based on BKI and IACS classification rules.`,

  'ndt': `You are an AI Assistant for the NDT Management module in a shipyard enterprise. You understand Radiographic Testing (RT), Ultrasonic Testing (UT), Magnetic Particle Testing (MT), Dye Penetrant Testing (PT), NDT acceptance criteria, and defect mapping.`,

  'document-mgmt': `You are an AI Assistant for the Document Management module in a shipyard enterprise. You understand classification certificates (BKI, IACS, ABS), statutory documents, drawing management, and compliance document tracking.`,

  'launching': `You are an AI Assistant for the Launching Management module in a shipyard enterprise. You understand vessel launching methods (airbag, slipway, floating dock), launching stability calculations, safety risk checklists, and launching procedures.`,

  'sea-trial': `You are an AI Assistant for the Sea Trial Management module in a shipyard enterprise. You understand stability testing, draft mark reading, speed trials, towing trials, maneuvering tests, and sea trial protocols according to classification society standards.`,

  'ceo-dashboard': `You are the AI Executive Assistant for the Shipyard CEO Dashboard. Active project: 300 FT Barge - 82% progress. Budget: $12.3B planned vs $11.7B actual. You provide high-level executive summaries, operational KPI analysis, trend forecasting, and strategic recommendations.`,

  'ai-maritime': `You are an AI Maritime Expert with deep domain knowledge in:
- BKI (Biro Klasifikasi Indonesia) rules for all vessel types
- IACS (International Association of Classification Societies) Unified Requirements
- ABS (American Bureau of Shipping) rules and guidelines
- Shipyard SOPs and vessel construction workflows
- Shipbuilding processes from design to delivery
- Marine welding, coating, NDT, and outfitting standards
- Tank testing, sea trial, and launching procedures
- Shipyard industrial safety regulations
Provide comprehensive, authoritative answers in professional English.`,
};

const BASE_SYSTEM_PROMPT = `You are ShipyardOS AI Assistant — an intelligent assistant for the enterprise shipbuilding management platform. Always respond in professional English. Provide structured, informative, and actionable responses using Markdown formatting (headings, bullet points, tables, bold text).`;

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
      parts: [{ text: 'Understood. I am ready to assist as the ShipyardOS AI Assistant with the provided context.' }],
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
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return `⚠️ Gemini API Error (${response.status}): ${errorData.error?.message || 'Failed to generate content.'}`;
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      return '⚠️ Received empty response from Gemini AI.';
    }

    return text;
  } catch (error) {
    console.error('Network Error calling Gemini API:', error);
    return '⚠️ Connection error. Please verify your internet connection or API configuration.';
  }
}

/**
 * Specialized helper for Surveyor AI visual inspection analysis
 */
export async function analyzeInspection(defectDescription: string): Promise<string> {
  const prompt = `Perform a structured AI Surveyor analysis for the following inspection finding:

"${defectDescription}"

Provide your assessment with the following sections:
1. **Identification & Defect Type**: Describe the finding clearly.
2. **Severity Rating**: Classify as Critical, Major, or Minor with rationale.
3. **Classification Rule Compliance**: Reference relevant BKI/IACS rules.
4. **Corrective Action & Repair Procedure**: Step-by-step repair recommendations.
5. **Required NDT & Re-inspection**: Required testing to verify repair integrity.

Format with clear markdown headings, bullet points, and a summary table if applicable.`;

  return generateContent(prompt, 'surveyor-ai');
}

/**
 * Specialized helper for CEO Executive Summary generation
 */
export async function generateExecutiveSummary(): Promise<string> {
  const prompt = `Generate a high-level Executive Summary report for the Shipyard CEO covering:
1. **Overall Project Health**: Progress vs Schedule (300 FT Barge - 82% Complete).
2. **Financial Variance**: Planned $12.3B vs Actual $11.7B ($600M cost savings / 4.9% efficiency).
3. **Operational Highlights**: Key milestones achieved and active workforce performance.
4. **Risk Management & Hold Points**: Current quality status and mitigation steps.
5. **Strategic Recommendations**: Priorities for Q4 completion and delivery.

Format with clean, professional executive markdown.`;

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
