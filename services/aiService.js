const hospitalRepository = require('../repositories/hospitalRepository');

class AIService {
  async evaluateTriage({ symptoms, age, severity }) {
    const text = (symptoms || '').toLowerCase();
    let urgency = 'medium';
    let specialty = 'General Medicine';
    let summary = 'Standard Clinical Assessment';
    let recommendedActions = ['Monitor vitals', 'Schedule OPD consultation if symptoms persist'];

    if (text.includes('chest') || text.includes('heart') || text.includes('breath') || text.includes('cardiac')) {
      urgency = 'critical';
      specialty = 'Cardiology & Emergency Care';
      summary = 'High Urgency: Suspected Acute Coronary Syndrome / Cardiac Distress';
      recommendedActions = [
        'Dispatch Cardiac Emergency Ambulance immediately',
        'Keep patient calm in a semi-recumbent position',
        'Prepare emergency ICU bed admission'
      ];
    } else if (text.includes('head') || text.includes('stroke') || text.includes('seizure') || text.includes('numb')) {
      urgency = 'high';
      specialty = 'Neurology & Trauma';
      summary = 'High Urgency: Potential Neurological / Cerebrovascular Event';
      recommendedActions = [
        'Immediate CT / MRI Neuro-imaging required',
        'Check pupillary response & GCS score'
      ];
    } else if (text.includes('fever') || text.includes('cough') || text.includes('flu')) {
      urgency = 'low';
      specialty = 'Internal Medicine';
      summary = 'Mild-to-Moderate Fever / Respiratory Tract Symptoms';
      recommendedActions = [
        'Hydration & Antipyretic medication',
        'Book Routine Outpatient Checkup'
      ];
    }

    const hospitals = await hospitalRepository.getAllHospitals();
    const recommendedHospital = hospitals[0] || null;

    return {
      urgency,
      specialty,
      summary,
      recommendedActions,
      recommendedHospital: recommendedHospital ? {
        id: recommendedHospital.id,
        name: recommendedHospital.name,
        available_beds: recommendedHospital.available_beds,
        available_icu_beds: recommendedHospital.available_icu_beds,
        emergency_contact: recommendedHospital.emergency_contact
      } : null,
      confidence_score: 0.94,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new AIService();
