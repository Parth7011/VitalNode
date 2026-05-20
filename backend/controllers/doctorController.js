const Doctor = require('../models/Doctor');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all doctors (with optional filters)
// @route   GET /api/doctors
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getAllDoctors = async (req, res) => {
  try {
    const { specialty, available } = req.query;

    let filter = {};
    if (specialty) filter.specialty = specialty;
    if (available !== undefined) filter.isAvailable = available === 'true';

    const doctors = await Doctor.find(filter).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (Doctor only)
// ─────────────────────────────────────────────────────────────────────────────
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllDoctors, getDoctorById, updateDoctorProfile };
