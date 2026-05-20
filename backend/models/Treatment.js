const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    condition: { type: String, default: 'General Checkup' },
    medicines: [{ type: String }],
    totalVisits: { type: Number, default: 3 },
    completedVisits: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['ongoing', 'completed'],
      default: 'ongoing',
    },
    observation: {
      type: String,
      enum: ['improvement', 'stable', 'concern', 'pending'],
      default: 'pending',
    },
    lastVisit: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Treatment', treatmentSchema);
