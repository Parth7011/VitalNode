const Appointment = require('../models/Appointment');
const { sendAppointmentEmail } = require('../utils/email');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
// ─────────────────────────────────────────────────────────────────────────────
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, reason, isEmergency, type, consultationFee, totalFee } = req.body;
    // Note: Backend might not have received date/time yet from doctor, 
    // so we use 'TBD' or the ones sent by patient (though patient usually doesn't set them now)
    const date = req.body.date || 'TBD';
    const time = req.body.time || 'TBD';

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
      status: 'pending',
      isEmergency: isEmergency || false,
      type: type || 'video',
      consultationFee: consultationFee || 0,
      totalFee: totalFee || 0,
    });

    const populated = await Appointment.findById(appointment._id).populate('doctor').populate('patient');
    const io = req.app.get('io');
    if (io && populated.doctor) {
        // Find the doctor's user reference to send the socket event
        io.to(populated.doctor.user.toString()).emit('newAppointment', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get appointments for the logged-in user (patient or doctor)
// @route   GET /api/appointments
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMyAppointments = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'doctor') {
      const Doctor = require('../models/Doctor');
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (!doctorProfile) {
        return res.json([]); // No doctor profile found
      }
      filter = { doctor: doctorProfile._id };
    } else {
      filter = { patient: req.user._id };
    }

    const appointments = await Appointment.find(filter)
      .populate('doctor', 'name specialty profileImage')
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update appointment status (confirm / cancel)
// @route   PUT /api/appointments/:id
// @access  Private (Doctor or Patient)
// ─────────────────────────────────────────────────────────────────────────────
const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = req.body.status || appointment.status;
    if (req.body.suggestedDate) appointment.suggestedDate = req.body.suggestedDate;
    if (req.body.suggestedTime) appointment.suggestedTime = req.body.suggestedTime;
    if (req.body.rescheduleMessage !== undefined) appointment.rescheduleMessage = req.body.rescheduleMessage;
    // When patient accepts the reschedule, update the actual date/time
    if (req.body.status === 'accepted' && appointment.suggestedDate) {
        appointment.date = appointment.suggestedDate;
        appointment.time = appointment.suggestedTime;
    }
    // When doctor initially accepts, update the actual date/time
    if (req.body.status === 'accepted' && req.body.date && req.body.time) {
        appointment.date = req.body.date;
        appointment.time = req.body.time;

        // Auto-create an ongoing treatment so it appears in Treatment Overview
        const Treatment = require('../models/Treatment');
        const existingTreatment = await Treatment.findOne({
            patient: appointment.patient,
            doctor: appointment.doctor,
            status: 'ongoing'
        });

        if (!existingTreatment) {
            await Treatment.create({
                patient: appointment.patient,
                doctor: appointment.doctor,
                condition: appointment.reason || 'General Consultation',
                status: 'ongoing',
                medicines: [],
                notes: '',
                totalVisits: 3,
                completedVisits: 0,
                observation: 'pending',
                lastVisit: new Date(appointment.date)
            });
        }
    }

    // When appointment is marked as completed, update the treatment progress
    if (req.body.status === 'completed') {
        const Treatment = require('../models/Treatment');
        const existingTreatment = await Treatment.findOne({
            patient: appointment.patient,
            doctor: appointment.doctor,
            status: 'ongoing'
        });
        if (existingTreatment) {
            existingTreatment.completedVisits += 1;
            existingTreatment.lastVisit = new Date();
            if (existingTreatment.completedVisits >= existingTreatment.totalVisits) {
                existingTreatment.status = 'completed';
            }
            await existingTreatment.save();
        }
    }

    const updated = await appointment.save();
    const populated = await Appointment.findById(updated._id).populate('patient').populate('doctor');

    // Send emails based on status change
    if (req.body.status === 'accepted' && req.user.role === 'doctor') {
        // Doctor accepted the original request
        await sendAppointmentEmail(
            populated.patient.email, populated.patient.name, populated.doctor.name,
            { date: populated.date, time: populated.time }, 'accepted'
        );
    } else if (req.body.status === 'rescheduled' && req.user.role === 'doctor') {
        // Doctor suggested new time
        await sendAppointmentEmail(
            populated.patient.email, populated.patient.name, populated.doctor.name,
            { suggestedDate: populated.suggestedDate, suggestedTime: populated.suggestedTime, rescheduleMessage: populated.rescheduleMessage }, 'rescheduled'
        );
    } else if (req.body.status === 'accepted' && req.user.role === 'patient') {
        // Patient accepted the new time (finalized)
        await sendAppointmentEmail(
            populated.patient.email, populated.patient.name, populated.doctor.name,
            { date: populated.date, time: populated.time }, 'finalized'
        );
    }

    // Emit real-time events via Socket.io
    const io = req.app.get('io');
    if (io) {
        // Notify patient and doctor
        io.to(populated.patient._id.toString()).emit('appointmentUpdated', populated);
        io.to(populated.doctor.user.toString()).emit('appointmentUpdated', populated); // Assuming doctor has a user reference
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Cancel / delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Patient)
// ─────────────────────────────────────────────────────────────────────────────
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};
