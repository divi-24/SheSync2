// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   passwordHash: { type: String, required: true },
//   role: { type: String, enum: ['user', 'parent'], default: 'user' },
//   parentOf: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // link parent to user
// }, { timestamps: true });

// export default mongoose.model('User', UserSchema);
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'parent'], default: 'user' },
  parentOf: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // link parent to user
  joinedCommunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }], // communities user has joined
  preferences: {
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'system' },
  },
  lastActive: { type: Date, default: Date.now },
  aiConsent: { type: Boolean, default: false },
  isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
