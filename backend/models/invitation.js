import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
  inviteeEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  inviterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviterName: { type: String, required: true },
  inviterEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  type: { type: String, enum: ['parent', 'partner'], required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  acceptedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now, expires: 2592000 }, // auto-delete after 30 days
}, { timestamps: true });

export default mongoose.model('Invitation', InvitationSchema);
