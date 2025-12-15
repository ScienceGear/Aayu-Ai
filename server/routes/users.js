const router = require('express').Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndDelete({ id: req.params.id });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
