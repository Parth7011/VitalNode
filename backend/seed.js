const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

dotenv.config();

const doctorsData = [
    {
        name: "Dr. Sarah Johnson",
        specialty: "General Physician",
        experience: 12,
        rating: 4.9,
        consultationFee: 500,
        bio: "Dr. Sarah is a highly experienced general physician specializing in holistic care and preventive medicine.",
        profileImage: "/images/doctors/sarah-johnson.png",
        email: "sarah@vitalnode.com", // Predictable email for login
    },
    {
        name: "Dr. Michael Chen",
        specialty: "Cardiology",
        experience: 15,
        rating: 4.8,
        consultationFee: 800,
        bio: "Dr. Michael Chen is a board-certified cardiologist specialized in non-invasive procedures and heart health management.",
        profileImage: "/images/doctors/michael-chen.png",
        email: "michael@vitalnode.com",
    },
    {
        name: "Dr. Emily Brown",
        specialty: "Dermatology",
        experience: 8,
        rating: 4.7,
        consultationFee: 600,
        bio: "Dr. Emily Brown focuses on medical dermatology and aesthetic procedures.",
        profileImage: "/images/doctors/emily-brown.png",
        email: "emily@vitalnode.com",
    },
    {
        name: "Dr. James Wilson",
        specialty: "Pediatrics",
        experience: 10,
        rating: 4.9,
        consultationFee: 450,
        bio: "Dr. James Wilson is a beloved pediatrician dedicated to child development and pediatric intensive care.",
        profileImage: "/images/doctors/james-wilson.png",
        email: "james@vitalnode.com",
    },
    {
        name: "Dr. Robert Taylor",
        specialty: "Orthopaedics",
        experience: 20,
        rating: 4.6,
        consultationFee: 700,
        bio: "A veteran in orthopaedic surgery, Dr. Taylor specializes in joint replacements and sports injuries.",
        profileImage: "/images/doctors/robert-taylor.png",
        email: "robert@vitalnode.com",
    },
    {
        name: "Dr. Lisa Wang",
        specialty: "Neurology",
        experience: 14,
        rating: 4.8,
        consultationFee: 900,
        bio: "Dr. Lisa Wang is a specialist in neurological disorders, including migraines and sleep disorders.",
        profileImage: "/images/doctors/lisa-wang.png",
        email: "lisa@vitalnode.com",
    }
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vitalnode');
        console.log('Connected to MongoDB');

        // Optional: Clear existing doctors
        await Doctor.deleteMany();
        await User.deleteMany({ role: 'doctor' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        for (const doc of doctorsData) {
            // Check if user already exists
            let user = await User.findOne({ email: doc.email });
            if (!user) {
                user = await User.create({
                    name: doc.name,
                    email: doc.email,
                    password: hashedPassword,
                    role: 'doctor',
                    profileImage: doc.profileImage
                });
                
                await Doctor.create({
                    user: user._id,
                    name: doc.name,
                    specialty: doc.specialty,
                    experience: doc.experience,
                    rating: doc.rating,
                    consultationFee: doc.consultationFee,
                    bio: doc.bio,
                    profileImage: doc.profileImage
                });
                console.log(`Seeded: ${doc.name}`);
            } else {
                console.log(`Skipped (Already exists): ${doc.name}`);
            }
        }

        console.log('Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDoctors();
