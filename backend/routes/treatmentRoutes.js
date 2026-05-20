const express = require('express');
const router = express.Router();
const { getMyTreatments, createOrUpdateTreatment } = require('../controllers/treatmentController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getMyTreatments);
router.post('/', protect, createOrUpdateTreatment);

module.exports = router;
