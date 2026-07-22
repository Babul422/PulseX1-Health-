function validateTriageInput(req, res, next) {
    try {
        let { symptoms } = req.body;

        if (!symptoms || typeof symptoms !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Please describe your symptoms before requesting clinical triage analysis.'
            });
        }

        symptoms = symptoms.trim();

        if (symptoms.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Symptom description is too short. Please provide more clinical details.'
            });
        }

        if (symptoms.length > 1000) {
            return res.status(400).json({
                success: false,
                error: 'Symptom description exceeds 1000 characters. Please summarize your main symptoms.'
            });
        }

        // Basic prompt injection guard
        const injectionPattern = /(ignore previous instructions|system prompt|disregard previous|override safety)/i;
        if (injectionPattern.test(symptoms)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid symptom format. Please enter valid clinical symptom descriptions.'
            });
        }

        req.sanitizedSymptoms = symptoms;
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Failed to process symptom validation.'
        });
    }
}

module.exports = {
    validateTriageInput
};
