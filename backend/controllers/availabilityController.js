const Doctor = require('../models/Doctor');

const updateAvailability = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        
        doctor.availability = {
            slotDuration: req.body.slotDuration || 30,
            schedule: req.body.schedule || {}
        };
        
        await doctor.save();
        res.json(doctor.availability);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAvailability = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor.availability || { slotDuration: 30, schedule: {} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { updateAvailability, getAvailability };
