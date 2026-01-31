import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentEmail: { type: String, required: true, lowercase: true, trim: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Optional: auto-delete after 24h
});

export default mongoose.model('Invitation', InvitationSchema);
