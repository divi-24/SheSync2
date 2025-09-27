// backend/controllers/symptomsController.js
import Symptoms from "../models/Symptoms.js";

/**
 * @desc Create or update symptoms for a given date
 * @route POST /api/symptoms
 * @access Private
 */
export const upsertSymptoms = async (req, res) => {
  try {
    const { date, cramps, headaches, moodSwings, bloating, breastTenderness, severity, notes } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required for symptoms entry." });
    }

    // Upsert: update existing entry or insert new
    const symptoms = await Symptoms.findOneAndUpdate(
      { user: req.user.id, date: new Date(date) },
      {
        user: req.user.id,
        date: new Date(date),
        cramps,
        headaches,
        moodSwings,
        bloating,
        breastTenderness,
        severity,
        notes,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(symptoms);
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
