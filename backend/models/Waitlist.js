import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    source: {
        type: String,
        enum: ['landing_page', 'footer', 'hero_section', 'other'],
        default: 'landing_page'
    },
    status: {
        type: String,
        enum: ['active', 'invited', 'removed'],
        default: 'active'
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        referrer: String
    }
}, {
    timestamps: true
});

// Indexes for performance (email index is already created by unique: true)
waitlistSchema.index({ status: 1 });
waitlistSchema.index({ createdAt: -1 });

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

export default Waitlist;