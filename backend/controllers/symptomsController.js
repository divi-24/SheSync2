// backend/controllers/symptomsController.js
import Symptoms from "../models/symptoms.js";
import symptomAnalysisService from "../services/symptomAnalysisService.js";

/**
 * @desc Create or update symptoms for a given date
 * @route POST /api/symptoms
 * @access Private
 */
export const upsertSymptoms = async (req, res) => {
  try {
    const { date, symptoms, symptomSeverities, cycleDay, notes } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required for symptoms entry." });
    }

    // Upsert: update existing entry or insert new
    const symptomEntry = await Symptoms.findOneAndUpdate(
      { user: req.user.id, date: new Date(date) },
      {
        user: req.user.id,
        date: new Date(date),
        symptoms: symptoms || [],
        symptomSeverities: symptomSeverities || {},
        cycleDay: cycleDay || null,
        notes: notes || "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(symptomEntry);
  } catch (error) {
    console.error("Error saving symptoms:", error);
    res.status(500).json({ message: "Server error while saving symptoms." });
  }
};

/**
 * @desc Get all symptoms logs for the logged-in user
 * @route GET /api/symptoms
 * @access Private
 */
export const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptoms.find({ user: req.user.id }).sort({ date: -1 });
    res.json(symptoms);
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    res.status(500).json({ message: "Server error while fetching symptoms." });
  }
};

/**
 * @desc Analyze symptoms with medical facts and personalized recommendations
 * @route POST /api/symptoms/analyze/advanced
 * @access Private
 */
export const analyzeSymptoms = async (req, res) => {
  try {
    console.log("[analyzeSymptoms] Request received");
    console.log("[analyzeSymptoms] Service loaded:", !!symptomAnalysisService);
    
    const { symptoms, severities, cycleDay } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: "At least one symptom is required for analysis." });
    }

    if (!symptomAnalysisService || !symptomAnalysisService.analyzeSymptoms) {
      console.error("[analyzeSymptoms] Service or method not available");
      return res.status(500).json({ message: "Analysis service not available." });
    }

    // Get advanced analysis with medical facts
    const analysis = await symptomAnalysisService.analyzeSymptoms(
      symptoms,
      severities || {},
      cycleDay || null,
      req.user?.id || null
    );

    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing symptoms:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ message: "Server error while analyzing symptoms.", error: error.message });
  }
};

/**
 * @desc Get symptoms log for a single day
 * @route GET /api/symptoms/:date
 * @access Private
 */
export const getSymptomsByDate = async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);
    const symptoms = await Symptoms.findOne({ user: req.user.id, date: targetDate });
    if (!symptoms) return res.status(404).json({ message: "No symptoms found for this date" });
    res.json(symptoms);
  } catch (error) {
    console.error("Error fetching symptoms by date:", error);
    res.status(500).json({ message: "Server error while fetching symptoms by date." });
  }
};
