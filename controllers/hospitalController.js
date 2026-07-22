const supabaseService = require('../services/supabaseService');

class HospitalController {
  async getAllHospitals(req, res, next) {
    try {
      const hospitals = await supabaseService.getAllHospitals();
      res.status(200).json({ success: true, data: hospitals });
    } catch (error) {
      next(error);
    }
  }

  async getHospitalById(req, res, next) {
    try {
      const { id } = req.params;
      const hospital = await supabaseService.getHospitalById(id);
      res.status(200).json({ success: true, data: hospital });
    } catch (error) {
      next(error);
    }
  }

  async updateBeds(req, res, next) {
    try {
      const { id } = req.params;
      const bedData = req.body;
      const updated = await supabaseService.updateBedAvailability(id, bedData);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async getBloodBanks(req, res, next) {
    try {
      const { id } = req.params;
      const bloodBanks = await supabaseService.getBloodBankByHospital(id);
      res.status(200).json({ success: true, data: bloodBanks });
    } catch (error) {
      next(error);
    }
  }

  async updateBloodInventory(req, res, next) {
    try {
      const { bloodBankId } = req.params;
      const { inventory } = req.body;
      const updated = await supabaseService.updateBloodInventory(bloodBankId, inventory);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async getAllAmbulances(req, res, next) {
    try {
      const ambulances = await supabaseService.getAllAmbulances();
      res.status(200).json({ success: true, data: ambulances });
    } catch (error) {
      next(error);
    }
  }

  async updateAmbulanceStatus(req, res, next) {
    try {
      const { ambulanceId } = req.params;
      const { status, location } = req.body;
      const updated = await supabaseService.updateAmbulanceStatus(ambulanceId, status, location);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HospitalController();
