const emergencyService = require('../services/emergencyService');

class EmergencyController {
  async triggerSOS(req, res, next) {
    try {
      const sosData = req.body;
      const result = await emergencyService.triggerSOS(sosData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getAllRequests(req, res, next) {
    try {
      const requests = await emergencyService.getAllRequests();
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  async getRequestById(req, res, next) {
    try {
      const { id } = req.params;
      const request = await emergencyService.getRequestById(id);
      res.status(200).json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, ambulanceId, hospitalId } = req.body;
      const updated = await emergencyService.updateStatus(id, status, ambulanceId, hospitalId);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmergencyController();
