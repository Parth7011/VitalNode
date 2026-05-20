const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All appointment routes are protected
router.use(protect);

router.post('/', authorize('patient'), bookAppointment);
router.get('/', getMyAppointments);
router.put('/:id', updateAppointmentStatus);
router.delete('/:id', authorize('patient'), cancelAppointment);

module.exports = router;
