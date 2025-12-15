const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const demoUsers = [
    {
        id: 'demo-elder-1',
        name: 'Ramesh Gupta',
        email: 'elder@aayu.com',
        password: 'password123',
        role: 'elder',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elder',
        age: 72,
        gender: 'male',
    },
    {
        id: 'demo-caregiver-1',
        name: 'Sarah Wilson',
        email: 'caregiver@aayu.com',
        password: 'password123',
        role: 'caregiver',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=caregiver',
        phone: '+91 98765 43210',
    },
    {
        id: 'demo-org-1',
        name: 'Aayu Health Admin',
        email: 'admin@aayu.com',
        password: 'password123',
        role: 'organization',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users to avoid duplicates if re-run
        await User.deleteMany({ email: { $in: demoUsers.map(u => u.email) } });

        await User.insertMany(demoUsers);
        console.log('Demo users seeded successfully');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
