const router = require('express').Router();
const User = require('../models/User');

// Register
router.post('/signup', async (req, res) => {
    try {
        // Check if user exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) return res.status(400).json({ message: 'Email already registered' });

        // Create new user (Password hashing should be added here in production)
        const newUser = new User(req.body);
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Simple password check (In production use bcrypt)
        if (user.password !== req.body.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
