import express from 'express';
import User from '../models/user.js';
import parentRequest from '../models/parentRequest.js';

const router = express.Router();

// GET /api/parent/connected-users - parent fetches all connected users
router.get('/connected-users', async (req, res) => {
  try {
    const parentEmail = req.query.email;
    if (!parentEmail) return res.status(400).json({ message: 'Parent email required' });
    const parent = await User.findOne({ email: parentEmail, role: 'parent' });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    const connections = await parentRequest.find({ parent: parent._id, status: 'accepted' }).populate('user');
    return res.json({ users: connections.map(c => c.user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/parent/user-connection - user fetches accepted parent connection
router.get('/user-connection', async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) return res.status(400).json({ message: 'User email required' });
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const connection = await parentRequest.findOne({ user: user._id, status: 'accepted' }).populate('parent');
    if (!connection) return res.json({ connection: null });
    return res.json({ connection });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/parent/pending - parent fetches all pending requests
router.get('/pending', async (req, res) => {
  try {
    // Get parent from auth (cookie)
    const parentEmail = req.query.email;
    if (!parentEmail) return res.status(400).json({ message: 'Parent email required' });
    const parent = await User.findOne({ email: parentEmail, role: 'parent' });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    const requests = await parentRequest.find({ parent: parent._id, status: 'pending' }).populate('user');
    return res.json({ requests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/parent/request - user requests parent
router.post('/request', async (req, res) => {
  try {
    const { email, parentEmail } = req.body;
    if (!email || !parentEmail) return res.status(400).json({ message: 'Email and parentEmail required' });
    const user = await User.findOne({ email });
    const parent = await User.findOne({ email: parentEmail, role: 'parent' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    // Check for existing request
    const existing = await parentRequest.findOne({ user: user._id, parent: parent._id, status: 'pending' });
    if (existing) return res.status(409).json({ message: 'Request already pending' });
    const request = await parentRequest.create({ user: user._id, parent: parent._id });
    return res.json({ message: 'Request sent to parent', request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/parent/decision - parent accepts/declines
router.post('/decision', async (req, res) => {
  try {
    const { requestId, decision } = req.body;
    if (!requestId || !decision) return res.status(400).json({ message: 'Missing fields' });
    const request = await parentRequest.findById(requestId).populate('user parent');
    if (!request || request.status !== 'pending') {
      return res.status(404).json({ message: 'No pending request found' });
    }
    request.status = decision === 'accept' ? 'accepted' : 'declined';
    await request.save();
    if (decision === 'accept') {
      return res.json({ user: request.user });
    } else {
      return res.json({ message: 'Request declined' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
// POST /api/parent/remove-connection - remove parent-user connection
router.post('/remove-connection', async (req, res) => {
  try {
    const { userEmail, parentEmail } = req.body;
    if (!userEmail || !parentEmail) {
      return res.status(400).json({ message: 'User and Parent email required' });
    }
    const user = await User.findOne({ email: userEmail });
    const parent = await User.findOne({ email: parentEmail, role: 'parent' });
    if (!user || !parent) {
      return res.status(404).json({ message: 'User or Parent not found' });
    }
    const result = await parentRequest.findOneAndDelete({ user: user._id, parent: parent._id, status: 'accepted' });
    if (result) {
      return res.status(200).json({ message: 'Connection removed' });
    } else {
      return res.status(404).json({ message: 'Connection not found' });
    }
  } catch (err) {
    console.error('Remove connection error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
