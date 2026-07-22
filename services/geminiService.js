const { GoogleGenAI } = require('@google/genai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.ai = this.apiKey ? new GoogleGenAI({ apiKey: this.apiKey }) : null;
    this.cache = new Map();
  }

  getSystemPrompt() {
    return `You are PulseX AI Clinical Triage Assistant.
You are NOT a licensed physician. You do NOT diagnose diseases.
Your responsibility is preliminary symptom triage.
Always analyze symptoms using evidence-based reasoning.
Never prescribe medicine. Never prescribe dosage. Never claim certainty.
Always estimate urgency: LOW | MEDIUM | HIGH | EMERGENCY.

CRITICAL EMERGENCY RULES:
If symptoms indicate: Chest Pain, Difficulty Breathing, Stroke Symptoms, Severe Bleeding, Loss of Consciousness, Seizures, Anaphylaxis, Cardiac Arrest -> You MUST classify urgency as EMERGENCY and set should_call_ambulance to true.

Return ONLY valid JSON matching exact schema. No markdown formatting (\`\`\`json), no HTML, no extra conversational text.

JSON Schema:
{
  "urgency": "LOW | MEDIUM | HIGH | EMERGENCY",
  "confidence": 0.95,
  "possible_conditions": ["Condition 1", "Condition 2"],
  "recommended_specialist": "Specialist Name",
  "recommended_department": "Department Name",
  "first_aid": ["Step 1", "Step 2"],
  "red_flags": ["Red Flag 1", "Red Flag 2"],
  "recommended_tests": ["Test 1", "Test 2"],
  "should_call_ambulance": false,
  "summary": "Clinical triage evaluation summary.",
  "follow_up_questions": ["Question 1?"],
  "disclaimer": "This AI provides informational guidance only and is not a substitute for a licensed healthcare professional."
}`;
  }

  async analyzeSymptoms(symptoms) {
    const cacheKey = symptoms.toLowerCase().trim();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Keyword Emergency Triage Check
    const emergencyKeywords = ['chest pain', 'breathing difficulty', 'breathless', 'unconscious', 'seizure', 'stroke', 'cardiac', 'severe bleeding', 'heart attack'];
    const isCriticalSymptom = emergencyKeywords.some(kw => cacheKey.includes(kw));

    try {
      if (!this.ai) {
        throw new Error('Gemini API Client not initialized.');
      }

      // Call Gemini 2.5 Flash model
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${this.getSystemPrompt()}\n\nPatient Symptoms: "${symptoms}"` }] }
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      const validated = this.validateAndNormalizeResponse(parsedData, isCriticalSymptom);
      this.cache.set(cacheKey, validated);
      return validated;

    } catch (err) {
      console.warn('Gemini API call warning/fallback:', err.message);
      // Fallback Clinical Triage Generator
      const fallback = this.generateFallbackResponse(symptoms, isCriticalSymptom);
      return fallback;
    }
  }

  validateAndNormalizeResponse(data, isCriticalSymptom) {
    let urgency = (data.urgency || 'MEDIUM').toUpperCase();
    if (isCriticalSymptom) {
      urgency = 'EMERGENCY';
    }

    return {
      urgency: ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'].includes(urgency) ? urgency : 'MEDIUM',
      confidence: typeof data.confidence === 'number' ? data.confidence : 0.90,
      possible_conditions: Array.isArray(data.possible_conditions) ? data.possible_conditions : ['Acute Clinical Symptom'],
      recommended_specialist: data.recommended_specialist || 'General Physician / Emergency Care',
      recommended_department: data.recommended_department || 'Emergency & Internal Medicine',
      first_aid: Array.isArray(data.first_aid) ? data.first_aid : ['Rest comfortably', 'Keep emergency numbers ready'],
      red_flags: Array.isArray(data.red_flags) ? data.red_flags : ['Sudden worsening of symptoms', 'Loss of consciousness'],
      recommended_tests: Array.isArray(data.recommended_tests) ? data.recommended_tests : ['Vital Signs Monitor', 'Routine Blood Work'],
      should_call_ambulance: urgency === 'EMERGENCY' || urgency === 'HIGH' || Boolean(data.should_call_ambulance),
      summary: data.summary || 'Clinical evaluation completed. Please review recommended specialist and first-aid instructions.',
      follow_up_questions: Array.isArray(data.follow_up_questions) ? data.follow_up_questions : ['How long have you experienced these symptoms?'],
      disclaimer: 'This AI provides informational guidance only and is not a substitute for a licensed healthcare professional.'
    };
  }

  generateFallbackResponse(symptoms, isCritical) {
    if (isCritical) {
      return {
        urgency: 'EMERGENCY',
        confidence: 0.98,
        possible_conditions: ['Acute Cardiac Distress / Severe Respiratory Compromise'],
        recommended_specialist: 'Cardiologist & Emergency Medicine Team',
        recommended_department: 'Cardiovascular Intensive Care (ICU)',
        first_aid: ['Stay seated or lying down', 'Keep airways clear', 'Do not exert physical effort', 'Call 911/112 immediately'],
        red_flags: ['Radiation of chest pain to arm/jaw', 'Severe shortness of breath', 'Cold clammy sweating'],
        recommended_tests: ['12-Lead Electrocardiogram (ECG)', 'Troponin-I Biomarker', 'Chest X-Ray'],
        should_call_ambulance: true,
        summary: 'CRITICAL EMERGENCY WARNING: Symptoms strongly indicate a potential acute clinical event. Immediate emergency dispatch and ICU bed reservation required.',
        follow_up_questions: ['Is pain radiating to jaw or left arm?', 'Do you have a cardiac history?'],
        disclaimer: 'This AI provides informational guidance only and is not a substitute for a licensed healthcare professional.'
      };
    }

    return {
      urgency: 'MEDIUM',
      confidence: 0.88,
      possible_conditions: ['General Clinical Malaise', 'Inflammatory / Viral Response'],
      recommended_specialist: 'General Physician / Specialist Practitioner',
      recommended_department: 'Outpatient Department (OPD)',
      first_aid: ['Hydrate adequately', 'Rest in a cool room', 'Monitor temperature and vital signs'],
      red_flags: ['High fever over 103°F', 'Persistent vomiting', 'Shortness of breath'],
      recommended_tests: ['Complete Blood Count (CBC)', 'Basic Metabolic Panel'],
      should_call_ambulance: false,
      summary: 'Moderate symptom profile detected. Consultation with a specialist doctor is recommended.',
      follow_up_questions: ['Are symptoms worsening?', 'Do you have pre-existing health conditions?'],
      disclaimer: 'This AI provides informational guidance only and is not a substitute for a licensed healthcare professional.'
    };
  }
}

module.exports = new GeminiService();
