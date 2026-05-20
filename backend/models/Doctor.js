const mongoose = require('mongoose');

/**
 * Doctor Model
 * Extends user data with doctor-specific fields.
 */
const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    bio: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    availability: {
      slotDuration: { type: Number, default: 30 },
      schedule: { type: mongoose.Schema.Types.Mixed, default: {} }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
