import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/user.js';
import ParentRequest from '../models/parentRequest.js';

const router = express.Router();

/**
 * Get pending requests for a parent
 * GET /api/parent/pending?email=parentEmail
 */
router.get('/pending', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    // Find parent user
    const parent = await User.findOne({ email, role: 'parent' });
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Find all ParentRequest records for this parent
    const requests = await ParentRequest.find({ parent: parent._id })
      .populate('user', '-passwordHash');

    res.json({
      requests: requests.map(req => ({
        _id: req._id.toString(),
        status: req.status,
        user: {
          _id: req.user._id.toString(),
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        }
      }))
    });
  } catch (err) {
    console.error('Pending requests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get connected users for a parent
 * GET /api/parent/connected-users?email=parentEmail
 */
router.get('/connected-users', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    // Find parent user
    const parent = await User.findOne({ email, role: 'parent' });
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Find all accepted ParentRequest records for this parent
    const requests = await ParentRequest.find({ 
      parent: parent._id, 
      status: 'accepted' 
    }).populate('user', '-passwordHash');

    const users = requests.map(req => ({
      _id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }));

    res.json({ users });
  } catch (err) {
    console.error('Connected users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get child that invited this parent
 * GET /api/parent/my-child?email=parentEmail
 */
router.get('/my-child', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    // Find parent user
    const parent = await User.findOne({ email, role: 'parent' });
    if (!parent) {
      return res.status(200).json({ child: null });
    }

    // Check if this parent has parentOf pointing to a child
    if (parent.parentOf) {
      const child = await User.findById(parent.parentOf).select('-passwordHash');
      if (child) {
        return res.json({
          child: {
            _id: child._id.toString(),
            name: child.name,
            email: child.email,
            role: child.role
          }
        });
      }
    }

    res.json({ child: null });
  } catch (err) {
    console.error('My child error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get connection between a user and their parent
 * GET /api/parent/user-connection?email=userEmail
 */
router.get('/user-connection', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has a connected parent (accepted ParentRequest)
    const parentRequest = await ParentRequest.findOne({
      user: user._id,
      status: 'accepted'
    }).populate('parent', '-passwordHash');

    if (parentRequest && parentRequest.parent) {
      return res.json({
        connection: {
          parent: {
            _id: parentRequest.parent._id.toString(),
            name: parentRequest.parent.name,
            email: parentRequest.parent.email,
            role: parentRequest.parent.role
          }
        }
      });
    }

    res.json({ connection: null });
  } catch (err) {
    console.error('User connection error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Handle parent decision on a connection request
 * POST /api/parent/decision
 */
router.post('/decision', async (req, res) => {
  try {
    const { requestId, decision } = req.body;
    if (!requestId || !decision) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const parentRequest = await ParentRequest.findById(requestId)
      .populate('user', '-passwordHash');

    if (!parentRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (decision === 'accept') {
      parentRequest.status = 'accepted';
      await parentRequest.save();
      
      return res.json({
        user: {
          _id: parentRequest.user._id.toString(),
          name: parentRequest.user.name,
          email: parentRequest.user.email,
          role: parentRequest.user.role
        }
      });
    } else if (decision === 'decline') {
      await ParentRequest.deleteOne({ _id: requestId });
      return res.json({ message: 'Request declined' });
    }

    res.status(400).json({ message: 'Invalid decision' });
  } catch (err) {
    console.error('Decision error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Remove connection between user and parent
 * POST /api/parent/remove-connection
 */
router.post('/remove-connection', async (req, res) => {
  try {
    const { userEmail, parentEmail } = req.body;
    if (!userEmail || !parentEmail) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await User.findOne({ email: userEmail });
    const parent = await User.findOne({ email: parentEmail });

    if (!user || !parent) {
      return res.status(404).json({ message: 'User or parent not found' });
    }

    // Remove the ParentRequest record
    await ParentRequest.deleteOne({
      user: user._id,
      parent: parent._id
    });

    res.json({ message: 'Connection removed' });
  } catch (err) {
    console.error('Remove connection error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
