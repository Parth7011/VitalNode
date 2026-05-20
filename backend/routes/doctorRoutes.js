const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById, updateDoctorProfile, createDoctor, deleteDoctor } = require('../controllers/doctorController');
const { getAvailability, updateAvailability } = require('../controllers/availabilityController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:doctorId/availability', getAvailability);

// Protected routes (Doctor only)
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctorProfile);
router.put('/profile/availability', protect, authorize('doctor'), updateAvailability);

// Admin only routes
router.post('/', protect, authorize('admin'), createDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
