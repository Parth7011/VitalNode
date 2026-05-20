const Doctor = require('../models/Doctor');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new doctor
// @route   POST /api/doctors
// @access  Private (Admin only)
// ─────────────────────────────────────────────────────────────────────────────
const createDoctor = async (req, res) => {
  try {
    const { name, specialty, qualification, experience, fee, availableHours, rating, image } = req.body;
    
    // Generate an email based on the name
    const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@vitalnode.com`;
    const password = 'password123'; // Default password

    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'doctor',
        profileImage: image || ''
      });
    }

    const doctor = await Doctor.create({
      user: user._id,
      name,
      specialty,
      qualification: qualification || 'MBBS, MD',
      experience: parseInt(experience) || 0,
      consultationFee: parseInt(fee) || 500,
      rating: parseFloat(rating) || 5.0,
      availableHours,
      profileImage: image || ''
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin only)
// ─────────────────────────────────────────────────────────────────────────────
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await User.findByIdAndDelete(doctor.user);
    await Doctor.findByIdAndDelete(req.params.id);

    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllDoctors, getDoctorById, updateDoctorProfile, createDoctor, deleteDoctor };
