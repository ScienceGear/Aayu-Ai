const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');
const path = require('path');
require('dotenv').config(); // relying on CWD being correct now
console.log("Loading env from CWD:", process.cwd());
console.log("URI:", process.env.MONGODB_URI ? "Found" : "Missing");

const demoMedicines = [
    {
        id: 'med-1',
        userId: 'demo-elder-1',
        assignedBy: 'self',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'twice-daily',
        time: '08:00',
        stock: 45,
        lowStockThreshold: 10,
        taken: false,
        withFood: true,
        image: ''
    },
    {
        id: 'med-2',
        userId: 'demo-elder-1',
        assignedBy: 'self',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'daily',
        time: '09:00',
        stock: 28,
        lowStockThreshold: 7,
        taken: false,
        withFood: false,
        image: ''
    },
    {
        id: 'med-3',
        userId: 'demo-elder-1',
        assignedBy: 'self',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'daily',
        time: '20:00',
        stock: 30,
        lowStockThreshold: 5,
        taken: false,
        withFood: true,
        image: ''
    },
    {
        id: 'med-4',
        userId: 'demo-elder-1',
        assignedBy: 'caretaker',
        caretakerNote: 'Please ensure he drinks water with this',
        name: 'Multi-Vitamin',
        dosage: '1 tablet',
        frequency: 'daily',
        time: '07:00',
        stock: 60,
        lowStockThreshold: 15,
        taken: true,
        withFood: true,
        image: ''
    },
    {
        id: 'med-5',
        userId: 'demo-elder-1',
        assignedBy: 'self',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'daily',
        time: '08:00',
        stock: 90,
        lowStockThreshold: 20,
        taken: false,
        withFood: true,
        image: ''
    },
    {
        id: 'med-6',
        userId: 'demo-elder-1',
        assignedBy: 'self',
        name: 'Omeprazole',
        dosage: '20mg',
        frequency: 'daily',
        time: '06:30',
        stock: 14,
        lowStockThreshold: 5,
        taken: false,
        withFood: false,
        image: ''
    }
];

const seedMedicines = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing medicines for this user
        await Medicine.deleteMany({ userId: 'demo-elder-1' });

        await Medicine.insertMany(demoMedicines);
        console.log('Demo medicines seeded successfully');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding medicines:', err);
        process.exit(1);
    }
};

seedMedicines();
