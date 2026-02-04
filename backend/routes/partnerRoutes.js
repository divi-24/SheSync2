import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/user.js";
import PeriodTracker from "../models/PeriodTracker.js";
import Cycle from "../models/cycle.js";
import Symptoms from "../models/symptoms.js";

const router = express.Router();

/**
 * @route GET /api/partner/dashboard/:userId
 * @desc Get health data (for connected parents/partners viewing their child/partner)
 * @access Private
 */
router.get("/dashboard/:userId", authMiddleware, async (req, res) => {
  try {
    const { id: loggedInId, role, parentOf } = req.user;
    const { userId } = req.params;

    // Role-based access control: parent can view child data if child invited them as parent
    if (role !== "parent") {
      return res.status(403).json({ message: "Only parents can access this data" });
    }

    if (parentOf !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Fetch partner's basic info
    const partner = await User.findById(userId).select("-passwordHash");
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Fetch partner's period tracker
    const periodTracker = await PeriodTracker.findOne({ userId, isActive: true });

    // Fetch partner's recent cycles
    const recentCycles = await Cycle.find({ user: userId })
      .sort({ startDate: -1 })
      .limit(3);

    // Fetch today's symptoms
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySymptoms = await Symptoms.findOne({
      user: userId,
      date: { $gte: today, $lt: tomorrow },
    });

    // Fetch recent mood entries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMoods = periodTracker?.moodTracking?.filter((m) => new Date(m.date) >= sevenDaysAgo) || [];

    res.json({
      partner,
      periodTracker,
      recentCycles,
      todaySymptoms,
      recentMoods,
    });
  } catch (error) {
    console.error("Error fetching partner dashboard:", error);
    res.status(500).json({ message: "Server error while fetching partner data" });
  }
});

/**
 * @route GET /api/partner/cycle-insights/:userId
 * @desc Get detailed cycle insights for the partner
 * @access Private
 */
router.get("/cycle-insights/:userId", authMiddleware, async (req, res) => {
  try {
    const { id: loggedInId, role, parentOf } = req.user;
    const { userId } = req.params;

    if (role !== "parent" || parentOf !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const cycles = await Cycle.find({ user: userId })
      .sort({ startDate: -1 })
      .limit(6);

    if (cycles.length === 0) {
      return res.json({ message: "No cycle data available", cycles: [] });
    }

    // Calculate patterns
    const cycleLengths = cycles.map((c) => c.cycleLength);
    const avgCycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);

    const predictions = {
      averageCycleLength: avgCycleLength,
      nextExpectedPeriod: cycles[0]?.nextPeriod,
      nextFertileWindow: {
        start: cycles[0]?.fertileStart,
        end: cycles[0]?.fertileEnd,
      },
      cycleRegularity:
        new Set(cycleLengths).size <= 2
          ? "Regular"
          : "Slightly irregular",
    };

    res.json({
      cycles,
      predictions,
    });
  } catch (error) {
    console.error("Error fetching cycle insights:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route GET /api/partner/symptom-summary/:userId
 * @desc Get summary of partner's recent symptoms
 * @access Private
 */
router.get("/symptom-summary/:userId", authMiddleware, async (req, res) => {
  try {
    const { id: loggedInId, role, parentOf } = req.user;
    const { userId } = req.params;

    if (role !== "parent" || parentOf !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Get symptoms from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSymptoms = await Symptoms.find({
      user: userId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    // Calculate frequency of each symptom
    const symptomFrequency = {
      cramps: 0,
      headaches: 0,
      moodSwings: 0,
      bloating: 0,
      breastTenderness: 0,
    };

    const avgSeverity = {
      cramps: [],
      headaches: [],
      moodSwings: [],
      bloating: [],
      breastTenderness: [],
    };

    recentSymptoms.forEach((sym) => {
      Object.keys(symptomFrequency).forEach((key) => {
        if (sym[key]) {
          symptomFrequency[key]++;
          if (sym.severity?.[key] !== undefined) {
            avgSeverity[key].push(sym.severity[key]);
          }
        }
      });
    });

    const avgSeverityCalculated = {};
    Object.keys(avgSeverity).forEach((key) => {
      if (avgSeverity[key].length > 0) {
        avgSeverityCalculated[key] = Math.round(
          avgSeverity[key].reduce((a, b) => a + b, 0) / avgSeverity[key].length
        );
      } else {
        avgSeverityCalculated[key] = 0;
      }
    });

    res.json({
      period: "Last 30 days",
      totalEntries: recentSymptoms.length,
      symptomFrequency,
      averageSeverity: avgSeverityCalculated,
      mostCommonSymptoms: Object.entries(symptomFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([symptom, count]) => ({ symptom, count })),
    });
  } catch (error) {
    console.error("Error fetching symptom summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route POST /api/partner/care-message/:userId
 * @desc Send a care message to partner (future feature)
 * @access Private
 */
router.post("/care-message/:userId", authMiddleware, async (req, res) => {
  try {
    const { id: loggedInId, role, parentOf } = req.user;
    const { userId } = req.params;
    const { message } = req.body;

    if (role !== "parent" || parentOf !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // TODO: Implement message storage and notifications
    res.json({
      success: true,
      message: "Care message sent successfully (feature coming soon)",
    });
  } catch (error) {
    console.error("Error sending care message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
