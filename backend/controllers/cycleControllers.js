
import Cycle from "../models/cycle.js";

/**
 * @desc Create a new cycle for the logged-in user
 * @route POST /api/cycles
 * @access Private
 */
export const createCycle = async (req, res) => {
  try {
    const { startDate, cycleLength, lutealPhaseLength, menstrualDuration, symptoms, notes } = req.body;

    // Create cycle linked to authenticated user
    const cycle = new Cycle({
      user: req.user.id, // comes from authMiddleware
      startDate,
      cycleLength,
      lutealPhaseLength,
      menstrualDuration,
      symptoms,
      notes,
    });

    await cycle.save(); // pre('validate') will auto-calc derived fields

    res.status(201).json(cycle);
  } catch (error) {
    // Handle duplicate startDate (unique index)
    if (error.code === 11000) {
      return res.status(409).json({ message: "Cycle for this start date already exists." });
    }
    // Validation or casting errors
    if (error.name === "ValidationError") {
      return res.status(422).json({ message: error.message });
    }
    console.error("Error creating cycle:", error);
    res.status(500).json({ message: "Server error while creating cycle." });
  }
};

/**
 * @desc Get all cycles for the logged-in user
 * @route GET /api/cycles
 * @access Private
 */
export const getCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(cycles);
  } catch (error) {
    console.error("Error fetching cycles:", error);
    res.status(500).json({ message: "Server error while fetching cycles." });
  }
};

/**
 * @desc Get a single cycle by ID
 * @route GET /api/cycles/:id
 * @access Private
 */
export const getCycleById = async (req, res) => {
  try {
    const cycle = await Cycle.findOne({ _id: req.params.id, user: req.user.id });
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });
    res.json(cycle);
  } catch (error) {
    console.error("Error fetching cycle:", error);
    res.status(500).json({ message: "Server error while fetching cycle." });
  }
};

/**
 * @desc Update a cycle by ID
 * @route PUT /api/cycles/:id
 * @access Private
 */
export const updateCycle = async (req, res) => {
  try {
    const updates = req.body;
    const cycle = await Cycle.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });
    res.json(cycle);
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(422).json({ message: error.message });
    }
    // Handle invalid ObjectId / cast errors
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid cycle id" });
    }
    console.error("Error updating cycle:", error);
    res.status(500).json({ message: "Server error while updating cycle." });
  }
};

/**
 * @desc Delete a cycle by ID
 * @route DELETE /api/cycles/:id
 * @access Private
 */
export const deleteCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });
    res.json({ message: "Cycle deleted successfully" });
  } catch (error) {
    console.error("Error deleting cycle:", error);
    // handle cast error
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid cycle id" });
    }
    res.status(500).json({ message: "Server error while deleting cycle." });
  }
};
