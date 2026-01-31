import User from "../models/user.js";

// PATCH /api/user/privacy
// Body: { aiConsent?: boolean, isAnonymous?: boolean }
export async function patchPrivacySettings(req, res, next) {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        const { aiConsent, isAnonymous } = req.body;
        const update = {};
        if (typeof aiConsent === "boolean") update.aiConsent = aiConsent;
        if (typeof isAnonymous === "boolean") update.isAnonymous = isAnonymous;
        if (!Object.keys(update).length) return res.status(400).json({ error: "No valid fields to update" });
        const user = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true }).lean();
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
}

// PATCH /api/user/preferences
// Body: { language?: string, theme?: string }
export async function patchPreferencesSettings(req, res, next) {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        const { language, theme } = req.body;
        const update = {};
        if (typeof language === "string" && language.length <= 10) update["preferences.language"] = language;
        if (typeof theme === "string" && theme.length <= 20) update["preferences.theme"] = theme;
        if (!Object.keys(update).length) return res.status(400).json({ error: "No valid fields to update" });
        const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true, runValidators: true }).lean();
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
}

export default {
    patchPrivacySettings,
    patchPreferencesSettings,
};