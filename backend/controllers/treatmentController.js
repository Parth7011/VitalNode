const Treatment = require('../models/Treatment');

const getMyTreatments = async (req, res) => {
    try {
        const filter = req.user.role === 'doctor' ? { doctor: req.user._id } : { patient: req.user._id };
        const treatments = await Treatment.find(filter)
            .populate('doctor', 'name specialty')
            .populate('patient', 'name email');
        res.json(treatments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createOrUpdateTreatment = async (req, res) => {
    try {
        const { patientId, condition, medicines, totalVisits, completedVisits, notes, status, observation } = req.body;
        
        let treatment = await Treatment.findOne({ patient: patientId, doctor: req.user._id, status: 'ongoing' });
        
        if (treatment) {
            if (condition) treatment.condition = condition;
            if (medicines) treatment.medicines = medicines;
            if (totalVisits !== undefined) treatment.totalVisits = totalVisits;
            if (completedVisits !== undefined) treatment.completedVisits = completedVisits;
            if (notes !== undefined) treatment.notes = notes;
            if (status) treatment.status = status;
            if (observation) treatment.observation = observation;
            
            await treatment.save();
        } else {
            treatment = await Treatment.create({
                patient: patientId,
                doctor: req.user._id,
                condition,
                medicines: medicines || [],
                totalVisits: totalVisits || 3,
                notes: notes || '',
                status: 'ongoing',
                observation: 'pending'
            });
        }
        res.json(treatment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getMyTreatments, createOrUpdateTreatment };
