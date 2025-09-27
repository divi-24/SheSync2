import Pregnancy from "../models/Pregnancy.js";

/**
 * @desc Create a new pregnancy record
 * @route POST /api/pregnancy
 * @access Private
 */
export const createPregnancy = async (req, res) => {
  try {
    const {
      cycle,
      gestationalAge,
      dueDate,
      currentTrimester,
      firstTrimester,
      secondTrimester,
      thirdTrimester,
      milestones,
      daysUntilDue,
      babySize,
      babyWeight,
      weeklyTips,
      conceptionDate,
    } = req.body;

    // Ensure only one active pregnancy per user
    const existing = await Pregnancy.findOne({ user: req.user.id, active: true });
    if (existing) {
      return res.status(409).json({ message: "Active pregnancy already exists." });
    }

    const pregnancy = new Pregnancy({
      user: req.user.id,
      cycle,
      gestationalAge,
      dueDate,
      currentTrimester,
      firstTrimester,
      secondTrimester,
      thirdTrimester,
      milestones,
      daysUntilDue,
      babySize,
      babyWeight,
      weeklyTips,
      conceptionDate,
      active: true,
    });

    await pregnancy.save();
    res.status(201).json(pregnancy);
  } catch (error) {
    console.error("Error creating pregnancy:", error);
    res.status(500).json({ message: "Server error while creating pregnancy." });
  }
};

/**
 * @desc Get active pregnancy for the logged-in user
 * @route GET /api/pregnancy/active
 * @access Private
 */
export const getActivePregnancy = async (req, res) => {
  try {
    const pregnancy = await Pregnancy.findOne({ user: req.user.id, active: true });
    if (!pregnancy) return res.status(404).json({ message: "No active pregnancy found." });
    res.json(pregnancy);
  } catch (error) {
    console.error("Error fetching active pregnancy:", error);
    res.status(500).json({ message: "Server error while fetching active pregnancy." });
  }
};

/**
 * @desc Update pregnancy milestones or info
 * @route PUT /api/pregnancy/:id
 * @access Private
 */
export const updatePregnancy = async (req, res) => {
  try {
    const pregnancy = await Pregnancy.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!pregnancy) return res.status(404).json({ message: "Pregnancy not found" });
    res.json(pregnancy);
  } catch (error) {
    console.error("Error updating pregnancy:", error);
    res.status(500).json({ message: "Server error while updating pregnancy." });
  }
};

/**
 * @desc Mark pregnancy as inactive (archive after delivery/miscarriage)
 * @route PATCH /api/pregnancy/:id/archive
 * @access Private
 */
export const archivePregnancy = async (req, res) => {
  try {
    const pregnancy = await Pregnancy.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { active: false } },
      { new: true }
    );
    if (!pregnancy) return res.status(404).json({ message: "Pregnancy not found" });
    res.json(pregnancy);
  } catch (error) {
    console.error("Error archiving pregnancy:", error);
    res.status(500).json({ message: "Server error while archiving pregnancy." });
  }
};

/**
 * @desc Get pregnancy history (all records for user)
 * @route GET /api/pregnancy
 * @access Private
 */
export const getPregnancyHistory = async (req, res) => {
  try {
    const history = await Pregnancy.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("Error fetching pregnancy history:", error);
    res.status(500).json({ message: "Server error while fetching pregnancy history." });
  }
};
