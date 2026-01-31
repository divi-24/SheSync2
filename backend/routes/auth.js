import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Invitation from '../models/invitation.js';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const COOKIE_NAME = 'token';
const SESSION_COOKIE = 'session'; // non-httpOnly helper cookie for middleware

function createToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: Math.floor(JWT_EXPIRES_MS / 1000) + 's' }
  );
}

function createSessionPayload(user) {
  const exp = Date.now() + JWT_EXPIRES_MS;
  return { role: user.role, exp };
}

// set cookies helper
function setAuthCookies(res, user) {
  const token = createToken(user);
  const sessionPayload = createSessionPayload(user);
  // httpOnly JWT
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: JWT_EXPIRES_MS,
  });
  // non-httpOnly session helper (base64 JSON)
  const sessionStr = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
  res.cookie(SESSION_COOKIE, sessionStr, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: JWT_EXPIRES_MS,
  });
}

// clear both cookies
function clearAuthCookies(res) {
  res.clearCookie(COOKIE_NAME, { sameSite: 'lax' });
  res.clearCookie(SESSION_COOKIE, { sameSite: 'lax' });
}

// signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, passwordHash, role: role || 'user' });

    setAuthCookies(res, user);

    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    setAuthCookies(res, user);

    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// profile - authoritative check using httpOnly token
router.get('/profile', async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });
   return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, parentOf: user.parentOf || null } });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// logout
router.post('/logout', (req, res) => {
  clearAuthCookies(res);
  return res.json({ message: 'Logged out' });
});

//parent-login
router.post('/parent-accept-invite', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    // Find unused invitation
    const invitation = await Invitation.findOne({ parentEmail: email, used: false });
    if (!invitation) return res.status(400).json({ message: 'No valid invitation found' });

    // Check if parent user already exists
    const existingParent = await User.findOne({ email, role: 'parent' });
    if (existingParent) return res.status(409).json({ message: 'Invitation already accepted. Please login.' });

    // Create parent user with password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const parentUser = await User.create({
      name: 'Parent User', // You can ask parent to provide name later or via frontend
      email,
      passwordHash,
      role: 'parent',
      parentOf: invitation.userId,
    });

    // Mark invitation as used
    invitation.used = true;
    await invitation.save();

    // Set auth cookies for parent session
    setAuthCookies(res, parentUser);

    res.status(201).json({ user: { id: parentUser._id, email: parentUser.email, role: parentUser.role, parentOf: parentUser.parentOf } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
