const geminiService = require('../services/geminiService');

class TriageController {
  async analyzeTriage(req, res, next) {
    try {
      const symptoms = req.sanitizedSymptoms || req.body.symptoms || 'General discomfort';
      const triageResult = await geminiService.analyzeSymptoms(symptoms);

      return res.status(200).json({
        success: true,
        message: 'Clinical triage evaluation completed.',
        data: triageResult
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TriageController();
