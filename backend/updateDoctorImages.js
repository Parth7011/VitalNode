/**
 * Quick script to update profileImage on existing Doctor records
 * Run: node updateDoctorImages.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

const imageMap = {
    'Dr. Sarah Johnson': '/images/doctors/sarah-johnson.png',
    'Dr. Michael Chen': '/images/doctors/michael-chen.png',
    'Dr. Emily Brown': '/images/doctors/emily-brown.png',
    'Dr. James Wilson': '/images/doctors/james-wilson.png',
    'Dr. Robert Taylor': '/images/doctors/robert-taylor.png',
    'Dr. Lisa Wang': '/images/doctors/lisa-wang.png',
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const [name, image] of Object.entries(imageMap)) {
            const result = await Doctor.updateMany(
                { name },
                { $set: { profileImage: image } }
            );
            console.log(`Updated ${name}: ${result.modifiedCount} doc(s)`);
        }

        console.log('Done!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
