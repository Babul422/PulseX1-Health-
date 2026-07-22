const volunteerService = require('../services/volunteerService');

class VolunteerController {
  async getAllVolunteers(req, res, next) {
    try {
      const volunteers = await volunteerService.getAllVolunteers();
      res.status(200).json({ success: true, data: volunteers });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await volunteerService.updateStatus(id, status);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VolunteerController();
