const mongoose = require('mongoose');

/**
 * Appointment Model
 * Represents a booked consultation between a patient and a doctor.
 */
const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String, default: '' },
    suggestedDate: { type: String, default: '' },
    suggestedTime: { type: String, default: '' },
    rescheduleMessage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rescheduled', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    isEmergency: { type: Boolean, default: false },
    type: { type: String, enum: ['video', 'in-person'], default: 'video' },
    consultationFee: { type: Number, default: 0 },
    totalFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
