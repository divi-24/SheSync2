import jwt from "jsonwebtoken";
import User from "../models/user.js"; // adjust path if needed

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"; // fallback for dev

/**
 * Middleware: Verify user authentication via JWT
 * - Checks cookie (httpOnly) OR Authorization: Bearer token
 * - Verifies token with secret
 * - Attaches sanitized user object to req.user
 */
export async function authMiddleware(req, res, next) {
  try {
    // Extract token (prefer httpOnly cookie, fallback to Authorization header)
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Fetch user from DB (exclude passwordHash)
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach minimal, safe user object to request
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      parentOf: user.parentOf || null,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(500).json({ message: "Server error in authentication" });
  }
}
