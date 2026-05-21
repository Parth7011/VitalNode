const Treatment = require('../models/Treatment');
const Doctor = require('../models/Doctor');

const getMyTreatments = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'doctor') {
            const doctorProfile = await Doctor.findOne({ user: req.user._id });
            if (!doctorProfile) return res.json([]);
            filter = { doctor: doctorProfile._id };
        } else {
            filter = { patient: req.user._id };
        }
        const treatments = await Treatment.find(filter)
            .populate('doctor', 'name specialty profileImage')
            .populate('patient', 'name email')
            .sort({ updatedAt: -1 });
        res.json(treatments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createOrUpdateTreatment = async (req, res) => {
    try {
        const { patientId, condition, medicines, totalVisits, completedVisits, notes, status, observation } = req.body;
        
        let treatment;
        
        // If the user is a patient, they can only update the status of their own ongoing treatment
        if (req.user.role === 'patient') {
            treatment = await Treatment.findOne({ patient: req.user._id, status: 'ongoing' });
            if (!treatment) return res.status(404).json({ message: 'No ongoing treatment found' });
            if (status) treatment.status = status;
            await treatment.save();
        } else {
            // Resolve the Doctor ObjectId from the logged-in user
            const doctorProfile = await Doctor.findOne({ user: req.user._id });
            if (!doctorProfile) return res.status(400).json({ message: 'Doctor profile not found' });
            const doctorId = doctorProfile._id;

            treatment = await Treatment.findOne({ patient: patientId, doctor: doctorId, status: 'ongoing' });
            
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
                    doctor: doctorId,
                    condition,
                    medicines: medicines || [],
                    totalVisits: totalVisits || 3,
                    notes: notes || '',
                    status: 'ongoing',
                    observation: 'pending'
                });
            }
        }
        
        const populated = await Treatment.findById(treatment._id)
            .populate('doctor', 'name specialty profileImage')
            .populate('patient', 'name email');
        res.json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getMyTreatments, createOrUpdateTreatment };

