import Waitlist from '../models/Waitlist.js';
import rateLimit from 'express-rate-limit';
import validator from 'validator';

// Rate limiting middleware for waitlist endpoint
export const waitlistRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 requests per windowMs
    message: {
        error: 'Too many waitlist requests from this IP, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Join waitlist controller
export const joinWaitlist = async (req, res) => {
    try {
        const { email, source = 'landing_page' } = req.body;

        // Input validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                code: 'EMAIL_REQUIRED'
            });
        }

        // Sanitize and validate email
        const sanitizedEmail = validator.escape(email.toLowerCase().trim());

        if (!validator.isEmail(sanitizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address",
                code: 'INVALID_EMAIL'
            });
        }

        // Check if email already exists
        const existingEntry = await Waitlist.findOne({ email: sanitizedEmail });
        if (existingEntry) {
            return res.status(200).json({
                success: true,
                message: "You're already on our waitlist! We'll be in touch soon.",
                code: 'ALREADY_REGISTERED'
            });
        }

        // Collect metadata
        const metadata = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            referrer: req.get('Referer')
        };

        // Create waitlist entry
        const waitlistEntry = await Waitlist.create({
            email: sanitizedEmail,
            source: source,
            status: 'active',
            metadata
        });

        res.status(201).json({
            success: true,
            message: "🌸 Welcome to SheSync! You've successfully joined our waitlist.",
            code: 'SUCCESS',
            data: {
                id: waitlistEntry._id,
                email: waitlistEntry.email,
                joinedAt: waitlistEntry.createdAt
            }
        });

    } catch (error) {
        console.error('Waitlist join error:', error);

        // Handle duplicate key error (race condition)
        if (error.code === 11000) {
            return res.status(200).json({
                success: true,
                message: "You're already on our waitlist! We'll be in touch soon.",
                code: 'ALREADY_REGISTERED'
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            code: 'SERVER_ERROR'
        });
    }
};

// Get waitlist statistics (admin only)
export const getWaitlistStats = async (req, res) => {
    try {
        const totalCount = await Waitlist.countDocuments({ status: 'active' });
        const todayCount = await Waitlist.countDocuments({
            status: 'active',
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        const sourceStats = await Waitlist.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                total: totalCount,
                today: todayCount,
                sources: sourceStats
            }
        });
    } catch (error) {
        console.error('Waitlist stats error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics"
        });
    }
};

// Remove from waitlist
export const removeFromWaitlist = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Valid email is required"
            });
        }

        const sanitizedEmail = validator.escape(email.toLowerCase().trim());

        const result = await Waitlist.findOneAndUpdate(
            { email: sanitizedEmail },
            { status: 'removed' },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Email not found in waitlist"
            });
        }

        res.json({
            success: true,
            message: "Successfully removed from waitlist"
        });

    } catch (error) {
        console.error('Waitlist removal error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to remove from waitlist"
        });
    }
};