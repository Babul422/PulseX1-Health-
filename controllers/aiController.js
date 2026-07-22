const aiService = require('../services/aiService');

class AIController {
  async evaluateTriage(req, res, next) {
    try {
      const { symptoms, age, severity } = req.body;
      const evaluation = await aiService.evaluateTriage({ symptoms, age, severity });
      res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
